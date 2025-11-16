import rest_framework.exceptions as errors
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView, Response

from django.contrib.auth import get_user_model

from accounts.models import UserProfile
from suggestions.models import SuggestionModel

from .models import UserRating
from .serializers import UserRatingSerializer

User = get_user_model()


class UpdateOrModifySuggestionRating(APIView):
    """Update or modify suggestion rating"""

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        external_id = request.data.get("external_id")
        rating = int(request.data.get("rating"))
        comment = request.data.get("comment", "")
        image = request.FILES.get("image", None)

        if not rating or not isinstance(rating, int):
            raise errors.ValidationError("Rating is required")

        if rating < 1 or rating > 5:
            raise errors.ValidationError("Rating must be an integer between 1 and 5.")

        # Basic server-side image validation for production readiness
        if image is not None:
            max_bytes = 5 * 1024 * 1024  # 5 MB
            if getattr(image, "size", 0) > max_bytes:
                raise errors.ValidationError("Image size exceeds 5MB limit.")
            content_type = getattr(image, "content_type", "")
            if not content_type.startswith("image/"):
                raise errors.ValidationError("Only image files are allowed.")

        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
        except SuggestionModel.DoesNotExist:
            raise errors.ValidationError("Failed due to external ID not existing")

        user_profile = UserProfile.objects.get(user=request.user)
        review = UserRating.objects.filter(user=user_profile, suggestion=suggestion).first()

        if review:
            # If review already exists, update it
            review.rating = rating
            review.comment = comment
            if image is not None:
                review.image = image
            review.save()
        else:
            # If review does not exist, create it
            if image is not None:
                UserRating.objects.get_or_create(
                    user=user_profile,
                    suggestion=suggestion,
                    rating=rating,
                    comment=comment,
                    image=image,
                )
            else:
                UserRating.objects.get_or_create(
                    user=user_profile,
                    suggestion=suggestion,
                    rating=rating,
                    comment=comment,
                )
        updated = UserRating.objects.get(user=user_profile, suggestion=suggestion)
        serializer = UserRatingSerializer(updated)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetSuggestionReviews(APIView):
    """Check average rating and suggestions"""

    permission_classes = [AllowAny]

    def get(self, request):
        try:
            external_id = request.GET.get("external_id", "")

            suggestion = SuggestionModel.objects.get(external_id=external_id)

            reviews = UserRating.objects.filter(suggestion=suggestion)
            serializer = UserRatingSerializer(reviews, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SuggestionModel.DoesNotExist:
            raise errors.ValidationError("Failed due to external ID not existing")
