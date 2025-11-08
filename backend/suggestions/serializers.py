from rest_framework import serializers
from django.db.models import Avg
from .models import SuggestionModel


class SuggestionSerializer(serializers.ModelSerializer):
    # Average rating is computed by the serializer
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = SuggestionModel
        fields = [
            "external_id",
            "name",
            "category",
            "description",
            "url",
            "image",
            "average_rating",  # include the average rating field
        ]

    def get_average_rating(self, obj):
        return (
            obj.userrating_set.aggregate(avg=Avg("rating"))["avg"] or 0
        )  # 0 if no ratings
