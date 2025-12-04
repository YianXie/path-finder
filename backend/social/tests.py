from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from django.contrib.auth.models import User

from accounts.models import UserProfile
from suggestions.models import EXAMPLE_EXTERNAL_ID, SuggestionModel

from .models import UserRating


class UpdateOrModifySuggestionRatingTestCase(APITestCase):
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

    def test_update_or_modify_suggestion_rating_returns_400_rating_too_high(self):
        """Test that the update or modify suggestion rating endpoint returns status 400 when rating is too high"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": 6},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_or_modify_suggestion_rating_with_comment(self):
        """Test that the update or modify suggestion rating endpoint accepts comments"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": 4, "comment": "Great item!"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("comment", response.data)

    def test_update_or_modify_suggestion_rating_updates_existing_rating(self):
        """Test that updating an existing rating modifies it instead of creating a new one"""
        # Create initial rating
        user_profile = UserProfile.objects.get(user=self.user)
        suggestion = SuggestionModel.objects.get(external_id=EXAMPLE_EXTERNAL_ID)
        UserRating.objects.create(
            user=user_profile,
            suggestion=suggestion,
            rating=2,
            comment="Initial comment",
        )

        # Update the rating
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": EXAMPLE_EXTERNAL_ID, "rating": 5, "comment": "Updated comment"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["rating"], 5)
        self.assertEqual(response.data["comment"], "Updated comment")

        # Verify only one rating exists
        ratings_count = UserRating.objects.filter(user=user_profile, suggestion=suggestion).count()
        self.assertEqual(ratings_count, 1)

    def test_update_or_modify_suggestion_rating_returns_400_missing_external_id(self):
        """Test that the update or modify suggestion rating endpoint returns 400 when external_id is missing"""
        response = self.client.post(
            "/api/social/rate/",
            {"rating": 3},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_or_modify_suggestion_rating_returns_400_invalid_external_id(self):
        """Test that the update or modify suggestion rating endpoint returns 400 when external_id doesn't exist"""
        response = self.client.post(
            "/api/social/rate/",
            {"external_id": "nonexistent-id", "rating": 3},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class GetSuggestionReviewsTestCase(APITestCase):
    """Tests for the get suggestion reviews endpoint"""

    def setUp(self):
        """Set up test user, suggestion, and ratings"""
        self.user1 = User.objects.create_user(
            username="testuser1", email="test1@example.com", password="testpassword123"
        )
        self.user2 = User.objects.create_user(
            username="testuser2", email="test2@example.com", password="testpassword123"
        )
        self.access1 = AccessToken.for_user(self.user1)
        self.access2 = AccessToken.for_user(self.user2)

        self.user_profile1 = UserProfile.objects.create(user=self.user1, name="Test User 1")
        self.user_profile2 = UserProfile.objects.create(user=self.user2, name="Test User 2")

        self.suggestion = SuggestionModel.objects.create(
            external_id=EXAMPLE_EXTERNAL_ID,
            name="Example Item",
            category=["Example Category"],
            description="Example Description",
            url="https://example.com",
            image="https://example.com/image.jpg",
        )

    def test_get_suggestion_reviews_returns_ok(self):
        """Test that get suggestion reviews returns status ok"""
        # Create some ratings
        UserRating.objects.create(user=self.user_profile1, suggestion=self.suggestion, rating=4, comment="Great!")
        UserRating.objects.create(user=self.user_profile2, suggestion=self.suggestion, rating=5, comment="Excellent!")

        response = self.client.get(
            "/api/social/reviews/",
            {"external_id": EXAMPLE_EXTERNAL_ID},
            HTTP_AUTHORIZATION=f"Bearer {self.access1}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_suggestion_reviews_returns_401_unauthorized(self):
        """Test that get suggestion reviews returns 401 when not authenticated"""
        response = self.client.get("/api/social/reviews/", {"external_id": EXAMPLE_EXTERNAL_ID})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_suggestion_reviews_returns_empty_list(self):
        """Test that get suggestion reviews returns empty list when no reviews exist"""
        response = self.client.get(
            "/api/social/reviews/",
            {"external_id": EXAMPLE_EXTERNAL_ID},
            HTTP_AUTHORIZATION=f"Bearer {self.access1}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_get_suggestion_reviews_returns_400_invalid_external_id(self):
        """Test that get suggestion reviews returns 400 when external_id doesn't exist"""
        response = self.client.get(
            "/api/social/reviews/",
            {"external_id": "nonexistent-id"},
            HTTP_AUTHORIZATION=f"Bearer {self.access1}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_suggestion_reviews_returns_400_missing_external_id(self):
        """Test that get suggestion reviews returns 400 when external_id is missing"""
        response = self.client.get(
            "/api/social/reviews/",
            {},
            HTTP_AUTHORIZATION=f"Bearer {self.access1}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_suggestion_reviews_includes_user_info(self):
        """Test that get suggestion reviews includes user information"""
        UserRating.objects.create(user=self.user_profile1, suggestion=self.suggestion, rating=4, comment="Great!")

        response = self.client.get(
            "/api/social/reviews/",
            {"external_id": EXAMPLE_EXTERNAL_ID},
            HTTP_AUTHORIZATION=f"Bearer {self.access1}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("user", response.data[0])
        self.assertEqual(response.data[0]["user"]["name"], "Test User 1")


class GetUserReviewTestCase(APITestCase):
    """Tests for the get user review endpoint"""

    def setUp(self):
        """Set up test user and suggestion"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_profile = UserProfile.objects.create(user=self.user, name="Test User")

        self.suggestion = SuggestionModel.objects.create(
            external_id=EXAMPLE_EXTERNAL_ID,
            name="Example Item",
            category=["Example Category"],
            description="Example Description",
            url="https://example.com",
            image="https://example.com/image.jpg",
        )

    def test_get_user_review_returns_ok(self):
        """Test that get user review returns status ok when review exists"""
        UserRating.objects.create(
            user=self.user_profile,
            suggestion=self.suggestion,
            rating=4,
            comment="Great item!",
        )

        response = self.client.get(
            "/api/social/user-review/",
            {"external_id": EXAMPLE_EXTERNAL_ID},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["rating"], 4)
        self.assertEqual(response.data["comment"], "Great item!")

    def test_get_user_review_returns_none_when_no_review(self):
        """Test that get user review returns None when review doesn't exist"""
        response = self.client.get(
            "/api/social/user-review/",
            {"external_id": EXAMPLE_EXTERNAL_ID},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data)

    def test_get_user_review_returns_401_unauthorized(self):
        """Test that get user review returns 401 when not authenticated"""
        response = self.client.get("/api/social/user-review/", {"external_id": EXAMPLE_EXTERNAL_ID})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_review_returns_400_missing_external_id(self):
        """Test that get user review returns 400 when external_id is missing"""
        response = self.client.get(
            "/api/social/user-review/",
            {},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_review_returns_400_invalid_external_id(self):
        """Test that get user review returns 400 when external_id doesn't exist"""
        response = self.client.get(
            "/api/social/user-review/",
            {"external_id": "nonexistent-id"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_review_returns_only_current_user_review(self):
        """Test that get user review returns only the current user's review"""
        # Create another user and their review
        other_user = User.objects.create_user(
            username="otheruser", email="other@example.com", password="testpassword123"
        )
        other_user_profile = UserProfile.objects.create(user=other_user, name="Other User")
        UserRating.objects.create(
            user=other_user_profile,
            suggestion=self.suggestion,
            rating=2,
            comment="Not great",
        )

        # Create current user's review
        UserRating.objects.create(
            user=self.user_profile,
            suggestion=self.suggestion,
            rating=5,
            comment="Excellent!",
        )

        response = self.client.get(
            "/api/social/user-review/",
            {"external_id": EXAMPLE_EXTERNAL_ID},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["rating"], 5)
        self.assertEqual(response.data["comment"], "Excellent!")
