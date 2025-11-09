from django.urls import path

from . import views

urlpatterns = [
    path("rate", views.UpdateOrModifySuggestionRating.as_view()),
    path("average-rating", views.GetSuggestionRating.as_view())
]
