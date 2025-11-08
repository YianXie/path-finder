from django.contrib import admin

from pathfinder_api.utils import IDAdminModel

from . import models

# Register your models here.
admin.site.register(models.UserRating, IDAdminModel)
