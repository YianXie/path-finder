from django.db import models
from django.utils.text import slugify


def slug_from_name_category(name, category, description):
    base = f"{name}-{category}-{description}".lower()
    return slugify(base)[:64]


DEFAULT_IMAGE = r"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s"
DEFAULT_URL = ""
DEFAULT_DESCRIPTION = ""
EXAMPLE_EXTERNAL_ID = "example-example-this-is-an-example-item"


class SuggestionModel(models.Model):
    external_id = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=255)
    category = models.JSONField(default=list)
    tags = models.JSONField(default=list)
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


class SuggestionsCacheModel(models.Model):
    basic_information = models.JSONField(default=dict)
    interests = models.JSONField(default=list)
    goals = models.JSONField(default=list)
    other_goals = models.TextField(blank=True, null=True)
    suggestions_ids = models.JSONField(default=list)

    def __str__(self):
        return f"Interests: {self.interests} Goals: {self.goals} Other Goals: {self.other_goals}"
