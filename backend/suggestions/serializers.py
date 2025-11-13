from rest_framework import serializers

from django.db.models import Avg

from .models import SuggestionModel
from social.models import UserRating


class SuggestionSerializer(serializers.ModelSerializer):
    # Thse fields are computed by the serializer, using the function
    # get_average_rating
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = SuggestionModel
        fields = "__all__"

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
