from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from suggestions.models import SuggestionModel

# Create your models here.

User = get_user_model()


class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    suggestion = models.ForeignKey(SuggestionModel, on_delete=models.CASCADE)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
