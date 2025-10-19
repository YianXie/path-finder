import os
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from django.utils import timezone
from django.contrib.auth import get_user_model
from jwt import decode

from suggestions.models import SuggestionModel
from suggestions.serializers import SuggestionSerializer
from .models import UserModel
from .serializers import CustomRefreshToken

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
ALLOWED_GOOGLE_HD = os.getenv("ALLOWED_GOOGLE_HD")
User = get_user_model()


def issue_tokens_for_user(user: User):
    refresh = CustomRefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class GoogleLoginView(APIView):
    """Google Login View

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [AllowAny]

    def post(self, request):
        credential = request.data.get("credential")
        if not credential:
            return Response(
                {"status": "error", "message": "Credentials are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Verify Google ID token
            idinfo = id_token.verify_oauth2_token(
                credential, grequests.Request(), GOOGLE_CLIENT_ID
            )
            # Optional: host domain restriction (for Google Workspace)
            if ALLOWED_GOOGLE_HD and idinfo.get("hd") != ALLOWED_GOOGLE_HD:
                return Response(
                    {"detail": "Unauthorized hosted domain."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Extract user info
            sub = idinfo["sub"]  # Google unique user ID
            email = idinfo.get("email")
            email_verified = idinfo.get("email_verified", False)
            name = idinfo.get("name") or ""

            if not email or not email_verified:
                return Response(
                    {"detail": "Email not verified by Google."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Upsert user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": email.split("@")[0], "is_active": True},
            )
            # You can store google sub to avoid conflicts & for future checks
            if hasattr(user, "google_sub"):
                if not user.google_sub:
                    user.google_sub = sub  # custom field if you add it
            # Update profile fields you care about
            if not user.first_name and name:
                user.first_name = name.split(" ")[0]
            user.last_login = timezone.now()
            user.save()

            tokens = issue_tokens_for_user(user)

            UserModel.objects.update_or_create(email=email, name=name, google_sub=sub)

            return Response(
                {"tokens": tokens, "user": {"email": user.email, "name": name}}
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ParseTokenView(APIView):
    """Parse Token View

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response(
                {"status": "error", "message": "Token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payload = decode(token, options={"verify_signature": False})
            return Response({"payload": payload})
        except Exception as e:
            return Response(
                {"status": "error", "message": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class UserProfileView(APIView):
    """Get current user profile

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            # Try to get user data from UserModel first
            user_model = UserModel.objects.get(email=user.email)
            return Response(
                {
                    "email": user.email,
                    "name": user_model.name,
                    "google_sub": user_model.google_sub,
                }
            )
        except UserModel.DoesNotExist:
            # Fallback to Django user data
            return Response(
                {
                    "email": user.email,
                    "name": getattr(user, "first_name", "") or user.username,
                    "google_sub": getattr(user, "google_sub", None),
                }
            )


class SaveItemView(APIView):
    """Save item view

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            external_id = request.data.get("external_id")
            if not external_id:
                return Response(
                    {"status": "error", "message": "External ID is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_model = UserModel.objects.get(email=user.email)
            if external_id in user_model.saved_items:
                UserModel.objects.update_or_create(
                    email=user.email,
                    defaults={
                        "saved_items": [
                            item
                            for item in user_model.saved_items
                            if item != external_id
                        ]
                    },
                )
                return Response(
                    {"status": "ok", "message": "Item removed from saved items"},
                    status=status.HTTP_200_OK,
                )
            else:
                UserModel.objects.update_or_create(
                    email=user.email,
                    defaults={"saved_items": [*user_model.saved_items, external_id]},
                )
                return Response(
                    {"status": "ok", "message": "Item added to saved items"},
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            return Response(
                {"status": "error", "message": "Failed to save item: " + str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CheckItemSavedView(APIView):
    """Check if item is saved view

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            external_id = request.data.get("external_id")
            if not external_id:
                return Response(
                    {"status": "error", "message": "External ID is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user_model = UserModel.objects.get(email=user.email)
            if external_id in user_model.saved_items:
                return Response(
                    {"status": "ok", "message": "Item is saved", "is_saved": True},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"status": "ok", "message": "Item is not saved", "is_saved": False},
                    status=status.HTTP_200_OK,
                )

        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to check if item is saved: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SavedItemsView(APIView):
    """Saved items view

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            user_model = UserModel.objects.get(email=user.email)
            saved_items = user_model.saved_items
            suggestions = SuggestionModel.objects.filter(external_id__in=saved_items)
            return Response(
                {
                    "status": "ok",
                    "message": "Saved items retrieved successfully",
                    "suggestions": SuggestionSerializer(suggestions, many=True).data,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve saved items: " + str(e),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
