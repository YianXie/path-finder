from django.db import models

# Create your models here.

class UserRating(models.Model):
    user = models.ForeignKey("User")
    suggestion = models.ForeignKey("SuggestionModel")
    rating = models.IntegerField(min=1, max=5)