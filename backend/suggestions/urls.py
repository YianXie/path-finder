from django.urls import path

from . import views

urlpatterns = [
    path("health/", views.HealthCheckView.as_view(), name="health_check"),
    path(
        "suggestions/",
        views.SuggestionListView.as_view(),
        name="suggestions",
    ),
    path(
        "personalized-suggestions/",
        views.PersonalizedSuggestionsView.as_view(),
        name="personalized_suggestions",
    ),
    path(
        "suggestions/<str:external_id>/",
        views.SuggestionDetailView.as_view(),
        name="suggestion_detail",
    ),
    path(
        "suggestions-with-saved-status/<str:external_id>/",
        views.SuggestionDetailWithSavedStatusView.as_view(),
        name="suggestion_detail_with_saved_status",
    ),
]
