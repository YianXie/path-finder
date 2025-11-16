from rest_framework import serializers

from accounts.models import UserProfile

from .models import UserRating


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["name", "email"]


class UserRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserRating
        fields = ["id", "rating", "comment", "created_at", "user", "image"]
