from rest_framework.exceptions import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.paginator import Paginator

from accounts.models import UserModel
from suggestions.models import SuggestionModel
from suggestions.serializers import SuggestionSerializer


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


class SuggestionListWithSavedStatusView(APIView):
    """Suggestion List View with saved status for authenticated users"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            # Get pagination parameters
            page = int(request.GET.get("page", 1))
            page_size = int(
                request.GET.get("page_size", 50)
            )  # Default 50 items per page

            # Get all suggestions with pagination
            suggestions = SuggestionModel.objects.all().order_by("name")
            paginator = Paginator(suggestions, page_size)
            page_obj = paginator.get_page(page)

            serializer = SuggestionSerializer(page_obj, many=True)
            suggestions_data = serializer.data

            # Get user's saved items in a single query
            try:
                user_model = UserModel.objects.get(email=user.email)
                saved_items = set(user_model.saved_items)
            except UserModel.DoesNotExist:
                saved_items = set()

            # Add saved status to each suggestion
            for suggestion in suggestions_data:
                suggestion["is_saved"] = suggestion["external_id"] in saved_items

            return Response(
                {
                    "results": suggestions_data,
                    "pagination": {
                        "page": page,
                        "page_size": page_size,
                        "total_pages": paginator.num_pages,
                        "total_count": paginator.count,
                        "has_next": page_obj.has_next(),
                        "has_previous": page_obj.has_previous(),
                    },
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve suggestions: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SuggestionDetailView(APIView):
    """Suggestion Detail View"""

    permission_classes = [AllowAny]

    def get(self, request, external_id):
        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
            serializer = SuggestionSerializer(suggestion)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Handle suggestion not found
        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "error", "message": "Suggestion not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Other exceptions
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve suggestion: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SuggestionDetailWithSavedStatusView(APIView):
    """Suggestion Detail View with saved status for authenticated users"""

    permission_classes = [IsAuthenticated]

    def get(self, request, external_id):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
            user_model = UserModel.objects.get(email=user.email)
            saved_items = set(user_model.saved_items)
            is_saved = external_id in saved_items
            serializer = SuggestionSerializer(suggestion)

            return Response(
                {
                    "suggestion": serializer.data,
                    "is_saved": is_saved,
                },
                status=status.HTTP_200_OK,
            )

        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "error", "message": "Suggestion not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve suggestion: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
