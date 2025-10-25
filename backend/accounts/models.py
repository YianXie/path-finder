from django.db import models


class UserModel(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    google_sub = models.CharField(max_length=255, unique=True, null=True, blank=True)
    saved_items = models.JSONField(default=list)
    basic_information = models.JSONField(default=dict)
    interests = models.JSONField(default=list)
    goals = models.JSONField(default=list)
    other_goals = models.TextField(blank=True, null=True)
    finished_onboarding = models.BooleanField(default=False)

    def __str__(self):
        return self.name
