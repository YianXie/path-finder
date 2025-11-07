from celery import shared_task

from django.core.management import call_command


@shared_task(bind=True, max_retries=3)
def sync_sheet_task(self):
    """Celery task to sync sheet data"""

    try:
        call_command("sync_sheet")
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task
def clear_sessions():
    """Celery task to clear expired sessions"""

    call_command("clearsessions")
