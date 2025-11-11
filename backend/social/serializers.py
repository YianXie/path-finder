from rest_framework import serializers
from .models import UserRating

class UserRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRating
        fields = "__all__"