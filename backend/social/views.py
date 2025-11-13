import rest_framework.exceptions as errors
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView, Response

from django.contrib.auth import get_user_model

from accounts.models import UserProfile
from suggestions.models import SuggestionModel

from .models import UserRating
from .serializers import UserRatingSerializer

User = get_user_model()


class UpdateOrModifySuggestionRating(APIView):
    """Suggestion List View"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        external_id = request.data.get("external_id")
        try:
            rating = int(request.data.get("rating"))
        except ValueError:
            raise errors.ValidationError("Failed due to non-integer rating value")

        if rating < 1 or rating > 5:
            raise errors.ValidationError("Rating must be an integer between 1 and 5.")

        comment: str = request.data.get("comment")

        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
        except SuggestionModel.DoesNotExist:
            raise errors.ValidationError("Failed due to external ID not existing")

        user_profile = UserProfile.objects.get(email=request.user.email)
        review = UserRating.objects.filter(user=user_profile, suggestion=suggestion).first()

        if review:
            review.rating = rating
            review.comment = comment
            review.save()
        else:
            UserRating.objects.get_or_create(
                user=user_profile,
                suggestion=suggestion,
                rating=rating,
                comment=comment,
            )
        return Response({"status": "success"}, status=status.HTTP_200_OK)


class GetSuggestionReviews(APIView):
    """Check average rating and suggestions"""

    permission_classes = [AllowAny]

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
            raise errors.ValidationError("Failed due to external ID not existing")
