from django.urls import path

from . import views

urlpatterns = [
    path("google/", views.GoogleLoginView.as_view(), name="google_login"),
    path("parse-token/", views.ParseTokenView.as_view(), name="parse_token"),
    path("profile/", views.UserProfileView.as_view(), name="user_profile"),
    path("save-item/", views.SaveItemView.as_view(), name="save_item"),
    path(
        "check-item-saved/", views.CheckItemSavedView.as_view(), name="check_item_saved"
    ),
    path("saved-items/", views.SavedItemsView.as_view(), name="saved_items"),
    path(
        "update-user-information/",
        views.UpdateUserInformationView.as_view(),
        name="update_user_information",
    ),
]
