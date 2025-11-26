from django.urls import path

from . import views

urlpatterns = [
    path("rate/", views.UpdateOrModifySuggestionRating.as_view()),
    path("reviews/", views.GetSuggestionReviews.as_view()),
    path("user-review/", views.GetUserReview.as_view()),
]
