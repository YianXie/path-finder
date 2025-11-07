from django.contrib import admin

class IDAdminModel(admin.ModelAdmin):
    readonly_fields = ("id",)