from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from django.contrib.auth.models import User

from accounts.models import UserProfile
from suggestions.models import EXAMPLE_EXTERNAL_ID, SuggestionModel


# The token obtain endpoint are located at the root level of the API
class TokenObtainTestCase(APITestCase):
    """Tests for JWT token obtain endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")

    def test_obtain_token_with_valid_credentials(self):
        """Test obtaining JWT token with valid credentials"""
        response = self.client.post(
            "/api/token/",
            {"username": "testuser", "password": "testpassword123"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_obtain_token_with_invalid_credentials(self):
        """Test obtaining JWT token with invalid credentials"""
        response = self.client.post(
            "/api/token/",
            {"username": "testuser", "password": "wrongpassword"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_obtain_token_with_missing_fields(self):
        """Test obtaining JWT token with missing fields"""
        response = self.client.post("/api/token/", {"username": "testuser"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenRefreshTestCase(APITestCase):
    """Tests for JWT token refresh endpoint"""

    def setUp(self):
        """Set up test user and tokens"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.refresh = RefreshToken.for_user(self.user)

    def test_refresh_token_with_valid_refresh_token(self):
        """Test refreshing access token with valid refresh token"""
        response = self.client.post("/api/token/refresh/", {"refresh": str(self.refresh)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_refresh_token_with_invalid_refresh_token(self):
        """Test refreshing access token with invalid refresh token"""
        response = self.client.post("/api/token/refresh/", {"refresh": "invalidrefreshtoken123"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_refresh_token_with_missing_refresh_token(self):
        """Test refreshing access token with missing refresh token"""
        response = self.client.post("/api/token/refresh/", {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class HealthCheckTestCase(APITestCase):
    """Tests for the health check endpoint"""

    def test_health_check_returns_ok(self):
        """Test that the health check endpoint returns status ok"""
        response = self.client.get("/api/suggestions/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "PathFinder API is running")

    def test_health_check_allows_any_method(self):
        """Test that health check only accepts GET requests"""
        response = self.client.post("/api/suggestions/health/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class SuggestionListViewTestCase(APITestCase):
    """Tests for the suggestion list view endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")

    def test_suggestion_list_view_returns_ok(self):
        """Test that the suggestion list view endpoint returns status ok"""
        response = self.client.get("/api/suggestions/suggestions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SuggestionListWithSavedStatusViewTestCase(APITestCase):
    """Tests for the suggestion list with saved status view endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)

    def test_suggestion_list_with_saved_status_view_returns_ok(self):
        """Test that the suggestion list with saved status view endpoint returns status ok"""
        response = self.client.get(
            "/api/suggestions/personalized-suggestions/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_double_suggestion_list_with_saved_status_view_returns_same_request(self):
        """Test that the suggestion list with saved status view endpoint returns status ok"""
        response1 = self.client.get(
            "/api/suggestions/personalized-suggestions/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )

        response2 = self.client.get(
            "/api/suggestions/personalized-suggestions/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )

        self.assertEqual(response1.content, response2.content)

    def test_suggestion_list_with_saved_status_view_returns_401(self):
        """Test that the suggestion list with saved status view endpoint returns 401 if not authenticated"""
        response = self.client.get("/api/suggestions/personalized-suggestions/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class SuggestionDetailViewTestCase(APITestCase):
    """Tests for the suggestion detail view endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        SuggestionModel.objects.update_or_create(
            external_id=EXAMPLE_EXTERNAL_ID,
            name="Example Item",
            category=["Example Category"],
            description="Example Description",
            url="https://example.com",
            image="https://example.com/image.jpg",
        )

    def test_suggestion_detail_view_returns_ok(self):
        """Test that the suggestion detail view endpoint returns status ok"""
        response = self.client.get(f"/api/suggestions/suggestions/{EXAMPLE_EXTERNAL_ID}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_suggestion_detail_view_returns_404(self):
        """Test that the suggestion detail view endpoint returns 404 if the suggestion does not exist"""
        response = self.client.get("/api/suggestions/suggestions/1234567890/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SuggestionDetailWithSavedStatusViewTestCase(APITestCase):
    """Tests for the suggestion detail with saved status view endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        UserProfile.objects.update_or_create(
            user=self.user,
            defaults={
                "saved_items": [EXAMPLE_EXTERNAL_ID],
            },
        )
        self.access = AccessToken.for_user(self.user)
        SuggestionModel.objects.update_or_create(
            external_id=EXAMPLE_EXTERNAL_ID,
            name="Example Item",
            category=["Example Category"],
            description="Example Description",
            url="https://example.com",
            image="https://example.com/image.jpg",
        )

    def test_suggestion_detail_with_saved_status_view_returns_ok(self):
        """Test that the suggestion detail with saved status view endpoint returns status ok"""
        response = self.client.get(
            f"/api/suggestions/suggestions-with-saved-status/{EXAMPLE_EXTERNAL_ID}/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_suggestion_detail_with_saved_status_view_returns_401(self):
        """Test that the suggestion detail with saved status view endpoint returns 401 if not authenticated"""
        response = self.client.get(f"/api/suggestions/suggestions-with-saved-status/{EXAMPLE_EXTERNAL_ID}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_suggestion_detail_with_saved_status_view_returns_404(self):
        """Test that the suggestion detail with saved status view endpoint returns 404 if the suggestion does not exist"""
        response = self.client.get(
            "/api/suggestions/suggestions-with-saved-status/1234567890/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
