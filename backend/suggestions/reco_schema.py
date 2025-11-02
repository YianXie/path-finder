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
                        "id": {
                            "type": "string",
                        },
                        "score": {
                            "type": "number",
                        },
                    },
                    "required": ["id", "score"],
                    "additionalProperties": False,
                },
            },
        },
        "required": ["suggestions"],
        "additionalProperties": False,
    },
    strict=True,
)

SYSTEM_RULES = """You are a ranking engine for school clubs/tutoring/competitions. You are given a list of suggestions and a user's basic information, interests, goals, and additional information.

Tasks:
- Score each item in [0, 1] based on the user's basic information, interests, goals, and additional information.
- Never invent any information. Only use the information provided.
- If scores tie, sort in alphabetical order.

Sorting:
- +0.40 if tags are related (or similar) to user's interests.
- +0.30 if tags are related (or similar) to user's goals.
- +0.30 if tags are related (or similar) to user's additional information.
- -0.20 if tags are not related (or similar) to user's interests, goals, or additional information.

Do not give all items the same score. Sort all items.

Output: JSON only."""
