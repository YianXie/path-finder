from adrf.views import APIView as ADRFAPIView
from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from suggestions.models import SuggestionModel
from .models import UserRating

User = get_user_model()

class UpdateOrModifySuggestionRating(APIView):
    """Suggestion List View"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        suggestion_id = int(request.data.get("id"))
        rating_id = int(request.data.get("rating"))

        obj = UserRating.objects.get_or_create(user=request.user, suggestion=SuggestionModel.objects.get(id=suggestion_id), rating=rating)
        return Response()