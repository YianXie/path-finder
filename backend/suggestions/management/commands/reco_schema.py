from openai.types.shared_params.response_format_json_schema import JSONSchema

ACTIVITY_CLASSIFICATION_SCHEMA = JSONSchema(
    name="activity_classification",
    description="Classify a given activity into standardized tag categories based on its type, focus, and context.",
    schema={
        "type": "object",
        "properties": {
            "classification": {
                "type": "object",
                "properties": {
                    "interest_area": {
                        "type": "string",
                        "enum": [
                            "STEM & Innovation",
                            "Arts & Design",
                            "Sports & Fitness",
                            "Community & Service",
                            "Leadership & Governance",
                            "Culture & Language",
                            "Business & Entrepreneurship",
                            "Academic & Research",
                            "Lifestyle & Wellness",
                            "Gaming & Technology",
                        ],
                        "description": "Broad domain or subject area of the activity.",
                    },
                    "activity_type": {
                        "type": "string",
                        "enum": [
                            "Club",
                            "Competition",
                            "Workshop",
                            "Seminar / Talk",
                            "Volunteer Project",
                            "Exhibition / Performance",
                            "Hackathon / Challenge",
                            "Camp / Program",
                            "Online Activity",
                        ],
                        "description": "Format or structure of the activity.",
                    },
                    "skill_focus": {
                        "type": "array",
                        "description": "Key skills participants develop or use in this activity.",
                        "items": {
                            "type": "string",
                            "enum": [
                                "Leadership",
                                "Creativity",
                                "Collaboration",
                                "Problem Solving",
                                "Critical Thinking",
                                "Communication",
                                "Technical Skills",
                                "Physical Skills",
                                "Innovation",
                                "Artistic Expression",
                            ],
                        },
                        "minItems": 1,
                    },
                },
                "required": ["interest_area", "activity_type", "skill_focus"],
                "additionalProperties": False,
            }
        },
        "required": ["classification"],
        "additionalProperties": False,
    },
    strict=True,
)


SYSTEM_RULES = """You are an intelligent classification engine for extracurricular activities, clubs, and competitions.

Your task:
- Given a single activity name or short description, classify it according to standardized tag categories.
- Choose the most appropriate tag from each list based only on the activity's meaning and context.
- If multiple options could apply, select the one that best fits the activity's *primary* purpose.
- Be consistent and concise.

Guidelines:
- “Interest Area” = broad domain (e.g., STEM, Arts, Sports, Service, etc.)
- “Activity Type” = the structure or format (Club, Competition, Workshop, etc.)
- “Skill Focus” = core skills built or used
"""
