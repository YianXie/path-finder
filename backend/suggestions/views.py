from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser


@api_view(["GET"])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({"status": "ok", "message": "PathFinder API is running"})


class TestJWTAuthentication(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"status": "ok", "message": "JWT authentication test"})
