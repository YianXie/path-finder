from django.contrib import admin
from pathfinder_api.utils import IDAdminModel
from .models import UserModel

admin.site.register(UserModel, IDAdminModel)
