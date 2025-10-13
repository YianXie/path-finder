import os
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from django.utils import timezone
from django.contrib.auth import get_user_model

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
ALLOWED_GOOGLE_HD = os.getenv("ALLOWED_GOOGLE_HD")
User = get_user_model()


def issue_tokens_for_user(user: User):
    refresh = RefreshToken.for_user(user)
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
        credential = request.data.get("credentials")
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
            picture = idinfo.get("picture")  # optional

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
            return Response(
                {"tokens": tokens, "user": {"email": user.email, "name": name}}
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST,
            )
