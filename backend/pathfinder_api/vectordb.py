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


def vector_search(model, query_vec):
    objs = list(model.objects.all())
    dists = [np.linalg.norm(np.array(o.embedding) - query_vec).item() for o in objs]
    return sorted(zip(objs, dists), key=lambda x: x[1])  # Sort by distance, but return (objs, dists)
