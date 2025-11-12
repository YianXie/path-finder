from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from django.contrib.auth import get_user_model

from suggestions.models import SuggestionModel

from .models import UserRating
from .serializers import UserRatingSerializer

User = get_user_model()


class UpdateOrModifySuggestionRating(APIView):
    """Suggestion List View"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            external_id = request.data.get("external_id")
            try:
                rating = int(request.data.get("rating"))
            except ValueError:
                return Response(
                    {"status": "Failed due to non-integer rating value"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if rating < 1 or rating > 5:
                return Response(
                    {"status": "Failed due to rating outside of 1-5 range"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            comment: str = request.data.get("comment")

            suggestion = SuggestionModel.objects.get(external_id=external_id)

            review = UserRating.objects.filter(user=request.user, suggestion=suggestion)

            if len(review) > 0:
                review = review[0]
                review.rating = rating
                review.comment = comment
                review.save()
            else:
                UserRating.objects.get_or_create(
                    user=request.user,
                    suggestion=suggestion,
                    rating=rating,
                    comment=comment,
                )
            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "Failed due to external ID not existing"},
                status=status.HTTP_400_BAD_REQUEST,
            )

class GetSuggestionReviews(APIView):
    """Check average rating and amount of ratings"""

    def get(self, request):
        try:
            external_id = request.GET.get("external_id", "")

            suggestion = SuggestionModel.objects.get(external_id=external_id)

            reviews = UserRating.objects.filter(suggestion=suggestion)
            return Response(
                UserRatingSerializer(reviews, many=True).data,
                status=status.HTTP_200_OK,
            )
        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "Failed due to external ID not existing"},
                status=status.HTTP_400_BAD_REQUEST,
            )