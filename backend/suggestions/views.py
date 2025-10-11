from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(["GET"])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({"status": "ok", "message": "PathFinder API is running"})
