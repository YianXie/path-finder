from django.contrib import admin

from pathfinder_api.utils import IDAdminModel

from .models import UserProfile

admin.site.register(UserProfile, IDAdminModel)
