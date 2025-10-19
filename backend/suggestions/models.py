from django.db import models
from django.utils.text import slugify


def slug_from_name_category(name, category, description):
    base = f"{name}-{category}-{description}".lower()
    return slugify(base)[:64]


DEFAULT_IMAGE = r"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s"
DEFAULT_URL = ""
DEFAULT_DESCRIPTION = ""


class SuggestionModel(models.Model):
    external_id = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    category = models.JSONField(default=list)
    description = models.TextField(default=DEFAULT_DESCRIPTION)
    url = models.URLField(max_length=255, default=DEFAULT_URL)
    image = models.URLField(max_length=255, default=DEFAULT_IMAGE)
    created_at = models.DateTimeField(auto_now=True)

    @classmethod
    def external_id_from_row(cls, row):
        if row.get("external_id"):
            return str(row["external_id"]).strip()
        return slug_from_name_category(row["name"], row["category"], row["description"])

    def __str__(self):
        return self.name
