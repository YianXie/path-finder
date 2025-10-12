from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.health_check, name="health_check"),
    path("test-jwt/", views.TestJWTAuthentication.as_view(), name="test_jwt"),
]
