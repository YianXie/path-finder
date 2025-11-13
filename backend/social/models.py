from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from accounts.models import UserProfile
from suggestions.models import SuggestionModel


class UserRating(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    suggestion = models.ForeignKey(SuggestionModel, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
