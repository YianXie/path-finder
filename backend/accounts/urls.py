from django.urls import path
from . import views

urlpatterns = [
    path("google/", views.GoogleLoginView.as_view(), name="google_login"),
    path("parse-token/", views.ParseTokenView.as_view(), name="parse_token"),
    path("profile/", views.UserProfileView.as_view(), name="user_profile"),
]
