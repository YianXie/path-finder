from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from django.contrib.auth.models import User

from accounts.models import UserProfile
from suggestions.models import EXAMPLE_EXTERNAL_ID, SuggestionModel, SuggestionsCacheModel


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
        """Set up test user and suggestions"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_profile = UserProfile.objects.create(user=self.user, name="Test User", saved_items=["item1"])

        # Create multiple test suggestions
        for i in range(15):
            SuggestionModel.objects.create(
                external_id=f"item{i}",
                name=f"Test Item {i}",
                category=["Category A"],
                description=f"Description for item {i}",
                url="https://example.com",
                image="https://example.com/image.jpg",
            )

    def test_suggestion_list_view_returns_ok(self):
        """Test that the suggestion list view endpoint returns status ok"""
        response = self.client.get("/api/suggestions/suggestions/", HTTP_AUTHORIZATION=f"Bearer {self.access}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertIn("pagination", response.data)

    def test_suggestion_list_view_returns_401_unauthorized(self):
        """Test that the suggestion list view endpoint returns 401 when not authenticated"""
        response = self.client.get("/api/suggestions/suggestions/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_suggestion_list_view_pagination(self):
        """Test that the suggestion list view supports pagination"""
        response = self.client.get(
            "/api/suggestions/suggestions/",
            {"page": 1, "page_size": 5},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertEqual(response.data["pagination"]["page"], 1)
        self.assertEqual(response.data["pagination"]["page_size"], 5)
        self.assertTrue(response.data["pagination"]["has_next"])

    def test_suggestion_list_view_pagination_second_page(self):
        """Test that the suggestion list view pagination works for second page"""
        response = self.client.get(
            "/api/suggestions/suggestions/",
            {"page": 2, "page_size": 5},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 5)
        self.assertEqual(response.data["pagination"]["page"], 2)
        self.assertTrue(response.data["pagination"]["has_previous"])

    def test_suggestion_list_view_includes_saved_status(self):
        """Test that the suggestion list view includes saved status for authenticated users"""
        response = self.client.get("/api/suggestions/suggestions/", HTTP_AUTHORIZATION=f"Bearer {self.access}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if is_saved field is present in results
        if response.data["results"]:
            self.assertIn("is_saved", response.data["results"][0])
            # Check if item1 is marked as saved
            for item in response.data["results"]:
                if item["external_id"] == "item1":
                    self.assertTrue(item["is_saved"])

    def test_suggestion_list_view_default_page_size(self):
        """Test that the suggestion list view uses default page size of 50"""
        response = self.client.get("/api/suggestions/suggestions/", HTTP_AUTHORIZATION=f"Bearer {self.access}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["pagination"]["page_size"], 50)


class SuggestionListWithSavedStatusViewTestCase(APITestCase):
    """Tests for the suggestion list with saved status view endpoint"""

    def setUp(self):
        """Set up test user and suggestions"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            name="Test User",
            saved_items=[EXAMPLE_EXTERNAL_ID],
            basic_information={"role": "student", "grade": "10"},
            interests=["math", "science"],
            goals=["learn programming"],
        )

        # Create test suggestions
        suggestion = SuggestionModel.objects.update_or_create(
            external_id=EXAMPLE_EXTERNAL_ID,
            name="Example Item",
            category=["Example Category"],
            description="Example Description",
            url="https://example.com",
            image="https://example.com/image.jpg",
        )[0]

        # Create a cached suggestion to avoid OpenAI API calls in tests
        from suggestions.serializers import SuggestionSerializer

        serializer = SuggestionSerializer(suggestion)
        cached_suggestions = [serializer.data]

        SuggestionsCacheModel.objects.update_or_create(
            basic_information=self.user_profile.basic_information,
            interests=self.user_profile.interests,
            goals=self.user_profile.goals,
            other_goals=self.user_profile.other_goals,
            defaults={"suggestions": cached_suggestions},
        )

    def test_suggestion_list_with_saved_status_view_returns_ok(self):
        """Test that the suggestion list with saved status view endpoint returns status ok"""
        response = self.client.get(
            "/api/suggestions/personalized-suggestions/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("results", response.data)
        self.assertIn("pagination", response.data)

    def test_double_suggestion_list_with_saved_status_view_returns_same_request(self):
        """Test that the suggestion list with saved status view endpoint returns same cached results"""
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

    def test_suggestion_list_with_saved_status_view_pagination(self):
        """Test that the personalized suggestions view supports pagination"""
        response = self.client.get(
            "/api/suggestions/personalized-suggestions/",
            {"page": 1, "page_size": 10},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("pagination", response.data)
        self.assertEqual(response.data["pagination"]["page"], 1)
        self.assertEqual(response.data["pagination"]["page_size"], 10)

    def test_suggestion_list_with_saved_status_view_includes_saved_status(self):
        """Test that the personalized suggestions view includes saved status"""
        response = self.client.get(
            "/api/suggestions/personalized-suggestions/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if is_saved field is present
        if response.data["results"]:
            self.assertIn("is_saved", response.data["results"][0])
            # Check if EXAMPLE_EXTERNAL_ID is marked as saved
            for item in response.data["results"]:
                if item["external_id"] == EXAMPLE_EXTERNAL_ID:
                    self.assertTrue(item["is_saved"])


class SuggestionDetailViewTestCase(APITestCase):
    """Tests for the suggestion detail view endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
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
        response = self.client.get(
            f"/api/suggestions/suggestions/{EXAMPLE_EXTERNAL_ID}/", HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_suggestion_detail_view_returns_404(self):
        """Test that the suggestion detail view endpoint returns 404 if the suggestion does not exist"""
        response = self.client.get(
            "/api/suggestions/suggestions/1234567890/", HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_suggestion_detail_view_returns_401_unauthorized(self):
        """Test that the suggestion detail view endpoint returns 401 when not authenticated"""
        response = self.client.get(f"/api/suggestions/suggestions/{EXAMPLE_EXTERNAL_ID}/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_suggestion_detail_view_returns_correct_data(self):
        """Test that the suggestion detail view returns correct suggestion data"""
        response = self.client.get(
            f"/api/suggestions/suggestions/{EXAMPLE_EXTERNAL_ID}/", HTTP_AUTHORIZATION=f"Bearer {self.access}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("suggestion", response.data)
        self.assertEqual(response.data["suggestion"]["external_id"], EXAMPLE_EXTERNAL_ID)
        self.assertEqual(response.data["suggestion"]["name"], "Example Item")
        self.assertFalse(response.data["is_saved"])  # Default is False for this endpoint


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

    def test_suggestion_detail_with_saved_status_view_shows_saved_true(self):
        """Test that the suggestion detail with saved status view shows is_saved=True when item is saved"""
        response = self.client.get(
            f"/api/suggestions/suggestions-with-saved-status/{EXAMPLE_EXTERNAL_ID}/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_saved"])

    def test_suggestion_detail_with_saved_status_view_shows_saved_false(self):
        """Test that the suggestion detail with saved status view shows is_saved=False when item is not saved"""
        # Create a user without the item saved
        user2 = User.objects.create_user(username="testuser2", email="test2@example.com", password="testpassword123")
        UserProfile.objects.create(user=user2, name="Test User 2", saved_items=[])
        access2 = AccessToken.for_user(user2)

        response = self.client.get(
            f"/api/suggestions/suggestions-with-saved-status/{EXAMPLE_EXTERNAL_ID}/",
            HTTP_AUTHORIZATION=f"Bearer {access2}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_saved"])
