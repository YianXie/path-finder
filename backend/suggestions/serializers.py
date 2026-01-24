from rest_framework import serializers

from django.db.models import Avg

from accounts.models import UserProfile
from social.models import UserRating

from .models import SuggestionModel


class SuggestionSerializer(serializers.ModelSerializer):
    # These fields are computed by the serializer, using the function
    # get_average_rating. If the view provides annotations, they will be used instead
    # of executing additional queries
    average_rating = serializers.SerializerMethodField()
    rate_count = serializers.SerializerMethodField()
    saved_count = serializers.SerializerMethodField()

    class Meta:
        model = SuggestionModel
        # fields = "__all__"
        # Important: Do not return the embedding field
        exclude = ["embedding"]  # This uses fields = __all__, but excludes the specified

    def get_average_rating(self, obj):
        # Check if the view annotated this field (performance optimization)
        if hasattr(obj, 'avg_rating'):
            return obj.avg_rating or 0
        
        # Fallback to querying (less efficient but still works)
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
        # Check if the view annotated this field (performance optimization)
        if hasattr(obj, 'rating_count'):
            return obj.rating_count or 0
        
        # Fallback to querying (less efficient but still works)
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

        # Use Python-level filtering for SQLite compatibility
        # For PostgreSQL, you could use: UserProfile.objects.filter(saved_items__contains=[suggestion_id]).count()
        # However, to maintain compatibility with both SQLite and PostgreSQL:
        from django.db import connection
        
        # Check database backend
        if 'postgresql' in connection.vendor:
            # For PostgreSQL, use efficient database-level filtering
            saved_count = UserProfile.objects.filter(saved_items__contains=[suggestion_id]).count()
        else:
            # For SQLite, use raw SQL with JSON functions or iterate (less efficient but compatible)
            # Note: This is still better than loading all profiles if we can limit the queryset
            saved_count = sum(
                1 for profile in UserProfile.objects.only('saved_items').iterator()
                if suggestion_id in profile.saved_items
            )

        return saved_count
