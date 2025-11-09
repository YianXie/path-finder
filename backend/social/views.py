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
                rating_id = int(request.data.get("rating"))
            except ValueError:
                return Response(
                    {"status": "Failed due to non-integer rating value"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if rating_id < 1 or rating_id > 5:
                return Response(
                    {"status": "Failed due to rating outside of 1-5 range"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            comment = request.data.get("comment")

            suggestion = SuggestionModel.objects.get(external_id=external_id)

            review = UserRating.objects.filter(user=request.user, suggestion=suggestion)

            if len(review) > 0:
                review = review[0]
                review.rating = rating_id
                review.comment = comment
                review.save()
            else:
                UserRating.objects.get_or_create(
                    user=request.user,
                    suggestion=suggestion,
                    rating=rating_id,
                    comment=comment
                )
            return Response({"status": "success"}, status=status.HTTP_200_OK)
        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "Failed due to external ID not existing"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": f"Failed to update rating due to error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GetSuggestionRating(APIView):
    """Check average rating and amount of ratings"""

    def get(self, request):
        try:
            external_id = request.GET.get("external_id", "")

            suggestion = SuggestionModel.objects.get(external_id=external_id)

            reviews = UserRating.objects.filter(suggestion=suggestion)

            average_rating = 0
            for review in reviews:
                average_rating += review.rating

            if len(reviews) > 0:
                average_rating /= len(reviews)

            return Response(
                {"average_rating": average_rating, "num_ratings": len(reviews)},
                status=status.HTTP_200_OK,
            )
        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "Failed due to external ID not existing"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"status": f"Failed to fetch rating due to error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
        except Exception as e:
            return Response(
                {"status": f"Failed to fetch rating due to error: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
