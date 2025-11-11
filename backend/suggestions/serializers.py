from rest_framework import serializers
from django.db.models import Avg
from .models import SuggestionModel


class SuggestionSerializer(serializers.ModelSerializer):
    # Thse fields are computed by the serializer, using the function
    # get_average_rating
    average_rating = serializers.SerializerMethodField()
    total_ratings = serializers.SerializerMethodField()

    class Meta:
        model = SuggestionModel
        fields = "__all__"

    def get_average_rating(self, obj):
        return (
            obj.userrating_set.aggregate(avg=Avg("rating"))["avg"] or 0
        )  # 0 if no ratings

    def get_total_ratings(self, obj):
        return obj.userrating_set.count()  # let database do the work
