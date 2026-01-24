import functools
import json
import os
import threading

import numpy as np
from fastembed import TextEmbedding

from django.db import models


class LazySingleton:
    def __init__(self, factory):
        self._factory = factory  # The function to load the thing
        self._instance = None  # The current storage of the item
        self._lock = threading.Lock()
        self._pid = None  # Track which process created the instance

    def get(self):
        current_pid = os.getpid()

        # If process changed (due to autoreload), reset instance
        if self._pid != current_pid:
            with self._lock:
                if self._pid != current_pid:  # Make sure it has changed inside the lock
                    self._instance = None
                    self._pid = current_pid

        # Standard lazy init
        if self._instance is None:
            with self._lock:
                if self._instance is None:
                    self._instance = self._factory()
        return self._instance

    def __getattr__(self, name):
        return getattr(self.get(), name)


# Only loaded the first time it is used
model: TextEmbedding = LazySingleton(lambda: TextEmbedding())  # Use the base model


@functools.lru_cache
def get_embedding(data):
    return [vec.tolist() for vec in model.embed(data)]


class VectorField(models.Field):
    def __init__(self, dimensions, *args, **kwargs):
        self.dimensions = int(dimensions)
        super().__init__(*args, **kwargs)

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        kwargs["dimensions"] = self.dimensions
        return name, path, args, kwargs

    def db_type(self, connection):
        return "text"

    def get_prep_value(self, value):
        if value is None:
            return None
        return json.dumps(value)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return None
        return json.loads(value)


def vector_search(model, query_vec, limit=None):
    """
    Perform vector similarity search on a model with embeddings.
    
    Args:
        model: The Django model class to search
        query_vec: Query vector as numpy array or list
        limit: Optional limit on number of results to return
    
    Returns:
        List of tuples (object, distance) sorted by distance
    
    Note: For production use with large datasets, consider using a dedicated
    vector database like pgvector, Pinecone, or Weaviate. This implementation
    loads all embeddings into memory which doesn't scale beyond ~10k items.
    """
    # Use only() to load just the ID and embedding fields to reduce memory
    objs = list(model.objects.only('id', 'embedding'))
    
    # Convert query to numpy array if it's a list
    query_array = np.array(query_vec) if not isinstance(query_vec, np.ndarray) else query_vec
    
    # Calculate distances
    dists = [np.linalg.norm(np.array(o.embedding) - query_array).item() for o in objs]
    
    # Sort by distance
    sorted_results = sorted(zip(objs, dists), key=lambda x: x[1])
    
    # Apply limit if specified
    if limit is not None:
        sorted_results = sorted_results[:limit]
    
    return sorted_results  # Return (objs, dists) tuples
