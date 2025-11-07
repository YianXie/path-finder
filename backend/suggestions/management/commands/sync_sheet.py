import logging
import os
from datetime import datetime

import requests

from django.core.management.base import BaseCommand
from django.db import transaction

from suggestions.models import SuggestionModel

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

log_dirs = "./var/log"
if not os.path.exists(log_dirs):
    os.makedirs(log_dirs)
log_file_path = os.path.join(
    log_dirs, f"{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.log"
)

file_handler = logging.FileHandler(log_file_path)
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(
    logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
)
logger.addHandler(file_handler)

sheet_id = os.getenv("SHEET_ID")
SHEET_CSV_URL = f"https://opensheet.elk.sh/{sheet_id}/1"

MAPPING = {
    "name": "name",
    "category": ["category_1", "category_2"],
    "description": "description",
    "url": "url",
    "image": "image",
}


class Command(BaseCommand):
    """Sync suggestions from Google Sheet"""

    help = "Sync suggestions from Google Sheet"

    def add_arguments(self, parser):
        parser.add_argument("--csv-url", type=str, help="The URL of the CSV file")

    def handle(self, *args, **kwargs):
        csv_url = kwargs.get("csv_url")
        if not csv_url:
            csv_url = SHEET_CSV_URL

        self.stdout.write(self.style.NOTICE(f"Syncing suggestions from {csv_url}"))
        logger.info(f"Syncing suggestions from {csv_url}")
        response = requests.get(csv_url, timeout=30)
        response.raise_for_status()

        incoming_ext_ids = set()
        upserts = 0

        with transaction.atomic():
            for row in response.json():
                external_id = SuggestionModel.external_id_from_row(row)
                if not external_id:
                    continue

                payload = {}
                for key, value in MAPPING.items():
                    if isinstance(value, list):
                        val = row.get(key, "").strip().split(",")
                        val = [v.strip() for v in val]
                    else:
                        val = row.get(key, "").strip()
                    payload[key] = val

                if not payload.get("name"):
                    continue

                SuggestionModel.objects.update_or_create(
                    external_id=external_id,
                    total_rating_score=0,
                    total_ratings=0,
                    defaults=payload,
                )
                incoming_ext_ids.add(external_id)
                upserts += 1
                self.stdout.write(self.style.SUCCESS(f"Synced {external_id}"))
                logger.info(f"Synced {external_id}")

        self.stdout.write(self.style.SUCCESS(f"Synced {upserts}"))
