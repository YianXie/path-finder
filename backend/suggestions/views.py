from rest_framework.exceptions import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator
from suggestions.serializers import SuggestionSerializer
from suggestions.models import SuggestionModel
from accounts.models import UserModel


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
