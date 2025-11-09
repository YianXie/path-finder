from adrf.views import APIView as ADRFAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from django.contrib.auth import get_user_model

from suggestions.models import SuggestionModel

from .models import UserRating

User = get_user_model()


class UpdateOrModifySuggestionRating(APIView):
    """Suggestion List View"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            external_id = request.data.get("external_id")
            rating_id = int(request.data.get("rating"))

            suggestion = SuggestionModel.objects.get(external_id=external_id)

            review = UserRating.objects.filter(user=request.user, suggestion=suggestion)

            if len(review) > 0:
                review = review[0]
                review.rating = rating_id
                review.save()
            else:

                UserRating.objects.get_or_create(
                    user=request.user,
                    suggestion=suggestion,
                    rating=rating_id,
                )
            return Response({"status": "success"})
        except:
            return Response({"status": "failure"}, status=400)
