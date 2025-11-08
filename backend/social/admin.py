from django.contrib import admin
from . import models
from pathfinder_api.utils import IDAdminModel

# Register your models here.
admin.site.register(models.UserRating, IDAdminModel)
