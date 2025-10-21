from celery import shared_task

from django.core.management import call_command


@shared_task
def sync_sheet_task():
    call_command("sync_sheet")
