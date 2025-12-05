import os

import rest_framework.exceptions as errors
from google.auth.transport import requests as grequests
from google.oauth2 import id_token
from jwt import decode
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth import get_user_model
from django.utils import timezone

from suggestions.models import SuggestionModel
from suggestions.serializers import SuggestionSerializer

from .models import UserProfile
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
            raise errors.ValidationError("Credentials are required")

        try:
            # Verify Google ID token
            idinfo = id_token.verify_oauth2_token(credential, grequests.Request(), GOOGLE_CLIENT_ID)

            # Hosted domain restriction
            if ALLOWED_GOOGLE_HD and idinfo.get("hd") != ALLOWED_GOOGLE_HD:
                raise errors.PermissionDenied("Unauthorized hosted domain.")

            # Extract user info
            sub = idinfo["sub"]  # Google unique user ID
            email = idinfo.get("email")
            email_verified = idinfo.get("email_verified", False)
            name = idinfo.get("name") or ""

            if not email or not email_verified:
                raise errors.ValidationError("Email not verified by Google.")

            # Upsert user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={"username": email.split("@")[0], "is_active": True},
            )

            # Store google sub to avoid conflicts & for future checks
            if hasattr(user, "google_sub"):
                if not user.google_sub:
                    user.google_sub = sub  # custom field if you add it

            # Update profile fields
            if not user.first_name and name:
                user.first_name = name.split(" ")[0]
            user.last_login = timezone.now()
            user.save()

            tokens = issue_tokens_for_user(user)

            try:
                user_model = UserProfile.objects.get(user__email=email)
                finished_onboarding = user_model.finished_onboarding
            except UserProfile.DoesNotExist:
                finished_onboarding = False

            UserProfile.objects.update_or_create(
                user=user,
                name=name,
                google_sub=sub,
                finished_onboarding=finished_onboarding,
            )

            return Response(
                {
                    "tokens": tokens,
                    "user": {
                        "email": user.email,
                        "name": name,
                        "finished_onboarding": finished_onboarding,
                    },
                }
            )
        except Exception:
            raise errors.ValidationError("Invalid credentials")


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
            raise errors.ValidationError("Token is required")

        try:
            payload = decode(token, options={"verify_signature": False})
            return Response({"payload": payload})
        except Exception:
            raise errors.ValidationError("Invalid token")


class UserProfileView(APIView):
    """Get current user profile

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            user_model = UserProfile.objects.get(user=user)
            return Response(
                {
                    "email": user.email,
                    "name": user_model.name,
                    "google_sub": user_model.google_sub,
                    "finished_onboarding": user_model.finished_onboarding,
                    "basic_information": user_model.basic_information,
                    "interests": user_model.interests,
                    "goals": user_model.goals,
                    "other_goals": user_model.other_goals,
                    "saved_items": user_model.saved_items,
                },
                status=status.HTTP_200_OK,
            )
        except UserProfile.DoesNotExist:
            # Fallback to Django user data
            return Response(
                {"status": "error", "message": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
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

        external_id = request.data.get("external_id")
        if not external_id:
            raise errors.ValidationError("External ID is required")

        try:
            user_model = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise errors.NotFound("User not found")

        if external_id in user_model.saved_items:
            UserProfile.objects.update_or_create(
                user=user,
                defaults={"saved_items": [item for item in user_model.saved_items if item != external_id]},
            )
            return Response(
                {"status": "ok", "message": "Item removed from saved items"},
                status=status.HTTP_200_OK,
            )
        else:
            UserProfile.objects.update_or_create(
                user=user,
                defaults={"saved_items": [*user_model.saved_items, external_id]},
            )
            return Response(
                {"status": "ok", "message": "Item added to saved items"},
                status=status.HTTP_200_OK,
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
            raise errors.ValidationError("Authentication required")

        external_id = request.data.get("external_id")
        if not external_id:
            raise errors.ValidationError("External ID is required")

        try:
            user_model = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise errors.NotFound("User not found")

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

        try:
            user_model = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            raise errors.ValidationError("User not found")

        saved_items = user_model.saved_items
        suggestions = SuggestionModel.objects.filter(external_id__in=saved_items)
        suggestions_data = SuggestionSerializer(suggestions, many=True).data
        for suggestion in suggestions_data:
            suggestion["is_saved"] = True

        return Response(
            {
                "status": "ok",
                "message": "Saved items retrieved successfully",
                "suggestions": suggestions_data,
            },
            status=status.HTTP_200_OK,
        )


class UpdateUserInformationView(APIView):
    """Update user information view

    Args:
        APIView: APIView

    Returns:
        Response: Response
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        basic_information = request.data.get("basic_information")
        interests = request.data.get("interests")
        goals = request.data.get("goals")
        other_goals = request.data.get("other_goals")

        if not basic_information:
            raise errors.ValidationError("Basic information is required")

        if not interests:
            raise errors.ValidationError("Interests are required")

        if not goals:
            raise errors.ValidationError("Goals are required")

        user_model = UserProfile.objects.get(user=user)
        user_model.basic_information = basic_information
        user_model.interests = interests
        user_model.goals = goals
        user_model.other_goals = other_goals
        user_model.finished_onboarding = True
        user_model.save()
        return Response(
            {"status": "ok", "message": "User information updated successfully"},
            status=status.HTTP_200_OK,
        )
