from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.HealthCheck.as_view(), name="health_check"),
    path("test-jwt/", views.TestJWTAuthentication.as_view(), name="test_jwt"),
    path("suggestions/", views.GetSuggestions.as_view(), name="get_suggestions"),
]
