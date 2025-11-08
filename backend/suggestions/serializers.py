from rest_framework import serializers

from .models import SuggestionModel


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuggestionModel
        fields = "__all__"
