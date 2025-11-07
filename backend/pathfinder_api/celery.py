# Source - https://stackoverflow.com/questions/58658363/how-do-i-run-periodic-tasks-with-celery-beat
# Posted by Manish Kumar
# Retrieved 2025-11-06, License - CC BY-SA 4.0

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pathfinder_api.settings")

app = Celery("pathfinder_api")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()
