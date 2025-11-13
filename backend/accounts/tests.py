from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from django.contrib.auth.models import User

from accounts.models import UserProfile
from suggestions.models import EXAMPLE_EXTERNAL_ID, SuggestionModel


class GoogleLoginViewTestCase(APITestCase):
    """Tests for the Google login endpoint"""

    def test_google_login_missing_credential(self):
        """Test that Google login returns 400 when credential is missing"""
        response = self.client.post("/accounts/google/", {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.data["message"], "Credentials are required")

    def test_google_login_invalid_credential(self):
        """Test that Google login returns 400 when credential is invalid"""
        response = self.client.post("/accounts/google/", {"credential": "invalid_credential"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.data["message"], "Invalid credentials")

    def test_google_login_unauthorized_domain(self):
        """Test that Google login returns 403 for unauthorized domain"""
        # This test would require mocking the Google token verification
        # For now, we'll skip this as per user's instruction to skip Google auth issues
        pass


class ParseTokenViewTestCase(APITestCase):
    """Tests for the parse token endpoint"""

    def test_parse_token_missing_token(self):
        """Test that parse token returns 400 when token is missing"""
        response = self.client.post("/accounts/parse-token/", {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.data["message"], "Token is required")

    def test_parse_token_invalid_token(self):
        """Test that parse token returns 400 when token is invalid"""
        response = self.client.post("/accounts/parse-token/", {"token": "invalid_token"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.data["message"], "Invalid token")

    def test_parse_token_valid_token(self):
        """Test that parse token returns 200 with valid token"""
        # Create a test token
        user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        access_token = AccessToken.for_user(user)

        response = self.client.post("/accounts/parse-token/", {"token": str(access_token)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("payload", response.data)


class UserProfileViewTestCase(APITestCase):
    """Tests for the user profile endpoint"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)

    def test_user_profile_without_auth(self):
        """Test that user profile returns 401 when not authenticated"""
        response = self.client.get("/accounts/profile/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_profile_with_auth_no_usermodel(self):
        """Test that user profile returns fallback data when UserProfile doesn't exist"""
        response = self.client.get(
            "/accounts/profile/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@example.com")
        self.assertEqual(response.data["name"], "testuser")
        self.assertIsNone(response.data["google_sub"])

    def test_user_profile_with_auth_with_usermodel(self):
        """Test that user profile returns UserProfile data when it exists"""
        UserProfile.objects.create(
            email="test@example.com",
            name="Test User",
            google_sub="google_sub_123",
        )

        response = self.client.get(
            "/accounts/profile/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@example.com")
        self.assertEqual(response.data["name"], "Test User")
        self.assertEqual(response.data["google_sub"], "google_sub_123")


class SaveItemViewTestCase(APITestCase):
    """Tests for the save item endpoint"""

    def setUp(self):
        """Set up test user and UserProfile"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_model = UserProfile.objects.create(
            email="test@example.com",
            name="Test User",
            saved_items=[],
        )

    def test_save_item_without_auth(self):
        """Test that save item returns 401 when not authenticated"""
        response = self.client.post("/accounts/save-item/", {"external_id": "test123"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_save_item_missing_external_id(self):
        """Test that save item returns 400 when external_id is missing"""
        response = self.client.post(
            "/accounts/save-item/",
            {},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.data["message"], "External ID is required")

    def test_save_item_add_new_item(self):
        """Test that save item adds new item to saved items"""
        response = self.client.post(
            "/accounts/save-item/",
            {"external_id": "test123"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "Item added to saved items")

        # Check that item was added
        self.user_model.refresh_from_db()
        self.assertIn("test123", self.user_model.saved_items)

    def test_save_item_remove_existing_item(self):
        """Test that save item removes existing item from saved items"""
        # First add an item
        self.user_model.saved_items = ["test123"]
        self.user_model.save()

        response = self.client.post(
            "/accounts/save-item/",
            {"external_id": "test123"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "Item removed from saved items")

        # Check that item was removed
        self.user_model.refresh_from_db()
        self.assertNotIn("test123", self.user_model.saved_items)

    def test_save_item_user_model_not_found(self):
        """Test that save item returns 404 when UserProfile doesn't exist"""
        # Delete the UserProfile
        self.user_model.delete()

        response = self.client.post(
            "/accounts/save-item/",
            {"external_id": "test123"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("User not found", response.data["message"])


class CheckItemSavedViewTestCase(APITestCase):
    """Tests for the check item saved endpoint"""

    def setUp(self):
        """Set up test user and UserProfile"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_model = UserProfile.objects.create(
            email="test@example.com",
            name="Test User",
            saved_items=["saved_item_123"],
        )

    def test_check_item_saved_without_auth(self):
        """Test that check item saved returns 401 when not authenticated"""
        response = self.client.post("/accounts/check-item-saved/", {"external_id": "test123"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_check_item_saved_missing_external_id(self):
        """Test that check item saved returns 400 when external_id is missing"""
        response = self.client.post(
            "/accounts/check-item-saved/",
            {},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertEqual(response.data["message"], "External ID is required")

    def test_check_item_saved_item_is_saved(self):
        """Test that check item saved returns True when item is saved"""
        response = self.client.post(
            "/accounts/check-item-saved/",
            {"external_id": "saved_item_123"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "Item is saved")
        self.assertTrue(response.data["is_saved"])

    def test_check_item_saved_item_not_saved(self):
        """Test that check item saved returns False when item is not saved"""
        response = self.client.post(
            "/accounts/check-item-saved/",
            {"external_id": "not_saved_item_123"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "Item is not saved")
        self.assertFalse(response.data["is_saved"])

    def test_check_item_saved_user_model_not_found(self):
        """Test that check item saved returns 404 when UserProfile doesn't exist"""
        # Delete the UserProfile
        self.user_model.delete()

        response = self.client.post(
            "/accounts/check-item-saved/",
            {"external_id": "test123"},
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("User not found", response.data["message"])


class SavedItemsViewTestCase(APITestCase):
    """Tests for the saved items endpoint"""

    def setUp(self):
        """Set up test user, UserProfile, and suggestions"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_model = UserProfile.objects.create(
            email="test@example.com",
            name="Test User",
            saved_items=[EXAMPLE_EXTERNAL_ID],
        )

        # Create test suggestions
        SuggestionModel.objects.update_or_create(
            external_id=EXAMPLE_EXTERNAL_ID,
            name="Example Item",
            category=["Example Category"],
            description="Example Description",
            url="https://example.com",
            image="https://example.com/image.jpg",
        )

    def test_saved_items_without_auth(self):
        """Test that saved items returns 401 when not authenticated"""
        response = self.client.post("/accounts/saved-items/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_saved_items_with_auth(self):
        """Test that saved items returns user's saved items"""
        response = self.client.post(
            "/accounts/saved-items/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "Saved items retrieved successfully")
        self.assertEqual(len(response.data["suggestions"]), 1)
        self.assertEqual(response.data["suggestions"][0]["external_id"], EXAMPLE_EXTERNAL_ID)

    def test_saved_items_empty_list(self):
        """Test that saved items returns empty list when user has no saved items"""
        # Clear saved items
        self.user_model.saved_items = []
        self.user_model.save()

        response = self.client.post(
            "/accounts/saved-items/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "ok")
        self.assertEqual(response.data["message"], "Saved items retrieved successfully")
        self.assertEqual(len(response.data["suggestions"]), 0)

    def test_saved_items_user_model_not_found(self):
        """Test that saved items returns 400 when UserProfile doesn't exist"""
        # Delete the UserProfile
        self.user_model.delete()

        response = self.client.post(
            "/accounts/saved-items/",
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["status"], "error")
        self.assertIn("User not found", response.data["message"])


class TokenObtainTestCase(APITestCase):
    """Tests for JWT token obtain endpoint (from suggestions tests)"""

    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")

    def test_obtain_token_with_valid_credentials(self):
        """Test obtaining JWT token with valid credentials"""
        response = self.client.post("/api/token/", {"username": "testuser", "password": "testpassword123"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_obtain_token_with_invalid_credentials(self):
        """Test obtaining JWT token with invalid credentials"""
        response = self.client.post("/api/token/", {"username": "testuser", "password": "wrongpassword"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_obtain_token_with_missing_fields(self):
        """Test obtaining JWT token with missing fields"""
        response = self.client.post("/api/token/", {"username": "testuser"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenRefreshTestCase(APITestCase):
    """Tests for JWT token refresh endpoint (from suggestions tests)"""

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


class UpdateUserInformationViewTestCase(APITestCase):
    """Tests for the update user information endpoint"""

    BASIC_INFORMATION = {
        "role": "test123",
        "grade": "test123",
        "subject": "test123",
    }
    INTERESTS = ["test123"]
    GOALS = ["test123"]
    OTHER_GOALS = "test123"

    def setUp(self):
        """Set up test user and UserProfile"""
        self.user = User.objects.create_user(username="testuser", email="test@example.com", password="testpassword123")
        self.access = AccessToken.for_user(self.user)
        self.user_model = UserProfile.objects.create(
            email="test@example.com",
            name="Test User",
            finished_onboarding=False,
        )

    def test_update_user_information_with_auth(self):
        """Test that update user information returns 200 when user is authenticated"""
        response = self.client.post(
            "/accounts/update-user-information/",
            {
                "basic_information": self.BASIC_INFORMATION,
                "interests": self.INTERESTS,
                "goals": self.GOALS,
                "other_goals": self.OTHER_GOALS,
            },
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user_information_without_auth(self):
        """Test that update user information returns 401 when not authenticated"""
        response = self.client.post(
            "/accounts/update-user-information/",
            {
                "basic_information": self.BASIC_INFORMATION,
                "interests": self.INTERESTS,
                "goals": self.GOALS,
                "other_goals": self.OTHER_GOALS,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_user_information_missing_basic_information(self):
        """Test that update user information returns 400 when basic_information is missing"""
        response = self.client.post(
            "/accounts/update-user-information/",
            {
                "interests": self.INTERESTS,
                "goals": self.GOALS,
                "other_goals": self.OTHER_GOALS,
            },
            HTTP_AUTHORIZATION=f"Bearer {self.access}",
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
