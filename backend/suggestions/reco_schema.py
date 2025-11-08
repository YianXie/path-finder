from openai.types.shared_params.response_format_json_schema import JSONSchema

RANKING_SCHEMA = JSONSchema(
    name="ranking",
    description="A ranking of suggestions based on the user's profile and interests.",
    schema={
        "type": "object",
        "properties": {
            "suggestions": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "external_id": {
                            "type": "string",
                        },
                        "score": {
                            "type": "number",
                        },
                    },
                    "required": ["external_id", "score"],
                    "additionalProperties": False,
                },
            },
        },
        "required": ["suggestions"],
        "additionalProperties": False,
    },
    strict=True,
)

SYSTEM_RULES = """You are a ranking engine for highschool clubs/tutoring/competitions. You are given a list of suggestions and a user's basic information, interests, goals, and additional information.

Tasks:
- Score each item in [0, 100] based on the user's basic information, interests, goals, and additional information.
- Never invent any information. Only use the information provided.
- Then output the top 20 items with the highest score. If there are less than 20 items in total, output all items with their score. All items should have a score between 0 and 100.
- Output in JSON format, with the external_id and score for each item.

Scoring:
- +40 if tags are related (or similar) to user's interests.
- +30 if tags are related (or similar) to user's goals.
- +30 if tags are related (or similar) to user's additional information.
- -20 if tags are not related (or similar) to user's interests, goals, or additional information.

Output: JSON only."""
