from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


class HealthCheckTestCase(APITestCase):
    """Tests for the health check endpoint"""
    
    def test_health_check_returns_ok(self):
        """Test that the health check endpoint returns status ok"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')
        self.assertEqual(response.data['message'], 'PathFinder API is running')
    
    def test_health_check_allows_any_method(self):
        """Test that health check only accepts GET requests"""
        response = self.client.post('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class JWTAuthenticationTestCase(APITestCase):
    """Tests for JWT authentication"""
    
    def setUp(self):
        """Set up test user and client"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def test_jwt_authentication_without_token(self):
        """Test that protected endpoint requires authentication"""
        response = self.client.get('/api/test-jwt/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_jwt_authentication_with_valid_token(self):
        """Test that protected endpoint accepts valid JWT token"""
        # Generate token for user
        refresh = RefreshToken.for_user(self.user)
        access_token = str(refresh.access_token)
        
        # Make authenticated request
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        response = self.client.get('/api/test-jwt/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')
        self.assertEqual(response.data['message'], 'JWT authentication test')
    
    def test_jwt_authentication_with_invalid_token(self):
        """Test that protected endpoint rejects invalid JWT token"""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalidtoken123')
        response = self.client.get('/api/test-jwt/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenObtainTestCase(APITestCase):
    """Tests for JWT token obtain endpoint"""
    
    def setUp(self):
        """Set up test user"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def test_obtain_token_with_valid_credentials(self):
        """Test obtaining JWT token with valid credentials"""
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpassword123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_obtain_token_with_invalid_credentials(self):
        """Test obtaining JWT token with invalid credentials"""
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'wrongpassword'
        })
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_obtain_token_with_missing_fields(self):
        """Test obtaining JWT token with missing fields"""
        response = self.client.post('/api/token/', {
            'username': 'testuser'
        })
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TokenRefreshTestCase(APITestCase):
    """Tests for JWT token refresh endpoint"""
    
    def setUp(self):
        """Set up test user and tokens"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.refresh = RefreshToken.for_user(self.user)
    
    def test_refresh_token_with_valid_refresh_token(self):
        """Test refreshing access token with valid refresh token"""
        response = self.client.post('/api/token/refresh/', {
            'refresh': str(self.refresh)
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_refresh_token_with_invalid_refresh_token(self):
        """Test refreshing access token with invalid refresh token"""
        response = self.client.post('/api/token/refresh/', {
            'refresh': 'invalidrefreshtoken123'
        })
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_token_with_missing_refresh_token(self):
        """Test refreshing access token with missing refresh token"""
        response = self.client.post('/api/token/refresh/', {})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
