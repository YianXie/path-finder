import traceback

from rest_framework import status
from rest_framework.exceptions import APIException, ErrorDetail
from rest_framework.response import Response
from rest_framework.views import exception_handler

from django.contrib import admin


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
        # It isnt't a simple task to get the message. The data might be a dictionary,
        # list, or string, depending on the error message.
        data = response.data

        message = "No further details available"

        if isinstance(data, dict):
            # Return the detail or the first available value
            message = data.get("detail") or next(iter(data.values()), message)
        elif isinstance(data, list):
            # ErrorDetail inherits from str.
            # https://github.com/encode/django-rest-framework/blob/365d409adb43ebad7d8a42cab2407ec841d8038e/rest_framework/exceptions.py#L63
            message = str(data[0]) if len(data) >= 0 else message
        else:
            message = str(data)

        response.data = {
            "status": "error",
            "status_code": response.status_code,
            "message": message,
        }

    else:
        traceback.print_exception(type(exc), exc, exc.__traceback__)

        # If there is an exeption without any data, return a 500 error
        response = Response(
            {
                "status": "error",
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal server error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response
