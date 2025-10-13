from django.urls import path
from . import views

urlpatterns = [
    path("google/", views.GoogleLoginView.as_view(), name="google_login"),
]
