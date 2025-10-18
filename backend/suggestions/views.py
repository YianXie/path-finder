from rest_framework.exceptions import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from suggestions.serializers import SuggestionSerializer
from suggestions.models import SuggestionModel


class HealthCheckView(APIView):
    """Health Check View"""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "message": "PathFinder API is running"})


class SuggestionListView(APIView):
    """Suggestion List View"""

    permission_classes = [AllowAny]

    def get(self, request):
        suggestions = SuggestionModel.objects.all().order_by("name")
        serializer = SuggestionSerializer(suggestions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
