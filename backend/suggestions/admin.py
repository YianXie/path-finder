from django.contrib import admin

from pathfinder_api.utils import IDAdminModel

from .models import SuggestionModel, SuggestionsCacheModel

admin.site.register(SuggestionModel, IDAdminModel)
admin.site.register(SuggestionsCacheModel, IDAdminModel)
