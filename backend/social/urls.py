from django.urls import path

from . import views

urlpatterns = [
    path("rate", views.UpdateOrModifySuggestionRating.as_view())
]
