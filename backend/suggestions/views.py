import requests, os
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated


class HealthCheck(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "message": "PathFinder API is running"})


class TestJWTAuthentication(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"status": "ok", "message": "JWT authentication test"})


SHEET_CSV_URL = (
    "https://opensheet.elk.sh/1ktwR4Oqw4AhySra-prVWPH8fwbKbTK31T0N_2gWehnI/1"
)


@method_decorator(cache_page(60 * 5), name="dispatch")
class GetSuggestions(APIView):
    """Get Suggestions View

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        r = requests.get(SHEET_CSV_URL)
        r.raise_for_status()

        return Response(
            {"status": "ok", "message": "Suggestions retrieved", "data": r.json()}
        )


GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
ALLOWED_GOOGLE_HD = os.getenv("ALLOWED_GOOGLE_HD")
User = get_user_model()
