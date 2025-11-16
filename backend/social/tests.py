from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from django.contrib.auth.models import User

from accounts.models import UserProfile
from suggestions.models import EXAMPLE_EXTERNAL_ID, SuggestionModel


class UpdateOrModifySuggestionRatingTestCase(APITestCase):
    """Tests for the suggestion detail with saved status view endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpassword123"
        )
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

    def test_update_or_modify_suggestion_rating_returns_ok(self):
        """Test that the update or modify suggestion rating endpoint returns status ok"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": 3},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_or_modify_suggestion_rating_returns_401_unauthorized(self):
        """Test that the update or modify suggestion rating endpoint returns status 401 unauthorized"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": 3},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_or_modify_suggestion_rating_returns_400_non_integer_rating(self):
        """Test that the update or modify suggestion rating endpoint returns status 400 non-integer rating"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": "a"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_or_modify_suggestion_rating_returns_400_intger_out_of_range(self):
        """Test that the update or modify suggestion rating endpoint returns status 400 integer out of range"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": -1},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
