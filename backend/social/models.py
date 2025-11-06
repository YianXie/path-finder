from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from suggestions.models import SuggestionModel
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    suggestion = models.ForeignKey(SuggestionModel, on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])