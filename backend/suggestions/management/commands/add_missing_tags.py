import asyncio
import json
import logging
import os
from datetime import datetime

from openai import AsyncOpenAI

from django.core.management.base import BaseCommand

from suggestions.models import SuggestionModel

from .reco_schema import ACTIVITY_CLASSIFICATION_SCHEMA, SYSTEM_RULES

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


class Command(BaseCommand):
    """Add tags to all the activities"""

    help = "Add tags to all the activities"

    def handle(self, *args, **kwargs):
        logger.info("Adding missing tags")

        api_key = os.environ.get("OPENAI_API_KEY")
        client = AsyncOpenAI(api_key=api_key)

        for suggestion in SuggestionModel.objects.all():
            completion = asyncio.run(self.async_completions(client, suggestion))
            content = completion.choices[0].message.content
            content = json.loads(content)
            self.stdout.write(suggestion.name)
            self.stdout.write(json.dumps(content))
            classification = content["classification"]
            tags = (
                self.ensure_list(classification["interest_area"])
                + self.ensure_list(classification["activity_type"])
                + self.ensure_list(classification["skill_focus"])
            )
            suggestion.tags = tags
            suggestion.save()

        logger.info("Added missing tags")

    async def async_completions(self, client, suggestions):
        completion = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_RULES},
                {
                    "role": "user",
                    "content": json.dumps(
                        {
                            "name": suggestions.name,
                            "descripton": suggestions.description,
                        }
                    ),
                },
            ],
            response_format={
                "type": "json_schema",
                "json_schema": ACTIVITY_CLASSIFICATION_SCHEMA,
            },
            timeout=20_000,
            temperature=0,
        )
        return completion

    def ensure_list(self, a):
        if isinstance(a, list):
            return a
        if isinstance(a, str):
            return [a]
        return []
