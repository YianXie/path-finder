from django.contrib import admin
from rest_framework.views import exception_handler


class IDAdminModel(admin.ModelAdmin):
    readonly_fields = ("id",)


def custom_exception_handler(exc, context):
    # https://www.django-rest-framework.org/api-guide/exceptions/#custom-exception-handling

    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Response needs to look something like
    # {"status": "error", "status_code": "500", "message": "Internal Server Error"}
    if response is not None:
        message = response.data["detail"]
        response.data = {}
        response.data["status"] = "error"
        response.data["status_code"] = response.status_code
        response.data["message"] = message

    return response
