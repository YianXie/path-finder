from rest_framework import serializers

from accounts.models import UserProfile
from suggestions.models import SuggestionModel

from .models import UserRating


class SuggestionReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionModel
        fields = ["external_id", "name", "description"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["name", "user__email"]


class UserRatingSerializer(serializers.ModelSerializer):
    suggestion = SuggestionReviewSerializer()
    user = UserSerializer()

    class Meta:
        model = UserRating
        fields = ["id", "rating", "comment", "suggestion", "user"]
