from django.db import models
from django.utils.text import slugify


def slug_from_name_category(name, category):
    base = f"{name}-{category}".lower()
    return slugify(base)[:64]


class SuggestionModel(models.Model):
    external_id = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    category = models.JSONField(default=list)
    description = models.TextField()
    url = models.URLField(max_length=255)
    image = models.URLField(max_length=255)
    created_at = models.DateTimeField(auto_now=True)

    @classmethod
    def external_id_from_row(cls, row):
        if row.get("external_id"):
            return str(row["external_id"]).strip()
        return slug_from_name_category(row["name"], row["category"])

    def __str__(self):
        return self.name
