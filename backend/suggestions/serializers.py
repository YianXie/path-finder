from rest_framework import serializers

from django.db.models import Avg

from accounts.models import UserProfile
from social.models import UserRating

from .models import SuggestionModel


class SuggestionSerializer(serializers.ModelSerializer):
    # Thse fields are computed by the serializer, using the function
    # get_average_rating
    average_rating = serializers.SerializerMethodField()
    rate_count = serializers.SerializerMethodField()
    saved_count = serializers.SerializerMethodField()

    class Meta:
        model = SuggestionModel
        # fields = "__all__"
        # Important: Do not return the embedding field
        exclude = ["embedding"]  # This uses fields = __all__, but excludes the specified

    def get_average_rating(self, obj):
        suggestion_id = getattr(obj, "id", None)
        if suggestion_id is None and isinstance(obj, dict):
            suggestion_id = obj.get("id")

        if suggestion_id is None:
            return 0

        reviews = UserRating.objects.filter(suggestion_id=suggestion_id)
        if reviews.count() > 0:
            return reviews.aggregate(avg=Avg("rating"))["avg"] or 0
        return 0

    def get_rate_count(self, obj):
        suggestion_id = getattr(obj, "id", None)
        if suggestion_id is None and isinstance(obj, dict):
            suggestion_id = obj.get("id")

        if suggestion_id is None:
            return 0

        reviews = UserRating.objects.filter(suggestion_id=suggestion_id)
        return reviews.count()

    def get_saved_count(self, obj):
        suggestion_id = getattr(obj, "external_id", None)
        if suggestion_id is None and isinstance(obj, dict):
            suggestion_id = obj.get("external_id")

        if suggestion_id is None:
            return 0

        profiles = UserProfile.objects.all()
        saved_count = 0
        for profile in profiles:
            if suggestion_id in profile.saved_items:
                saved_count += 1

        return saved_count
