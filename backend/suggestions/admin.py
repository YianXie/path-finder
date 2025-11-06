from django.contrib import admin

from .models import SuggestionModel, SuggestionsCacheModel

admin.site.register(SuggestionModel)
admin.site.register(SuggestionCacheModel)
admin.site.register(SuggestionsCacheModel)
