from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.HealthCheck.as_view(), name="health_check"),
    path("suggestions/", views.GetSuggestions.as_view(), name="get_suggestions"),
]
