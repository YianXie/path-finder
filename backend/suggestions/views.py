import json
import os
from typing import Any

from adrf.views import APIView as ADRFAPIView
from asgiref.sync import sync_to_async
from openai import AsyncOpenAI
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.paginator import Paginator

from accounts.models import UserModel
from suggestions.models import SuggestionModel, SuggestionsCacheModel
from suggestions.reco_schema import RANKING_SCHEMA, SYSTEM_RULES
from suggestions.serializers import SuggestionSerializer


class HealthCheckView(APIView):
    """Health Check View"""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "message": "PathFinder API is running"})


class SuggestionListView(APIView):
    """Suggestion List View"""

    permission_classes = [AllowAny]

    def get(self, request):
        # Get pagination parameters
        try:
            page = int(request.GET.get("page", 1))
            page_size = int(
                request.GET.get("page_size", 50)
            )  # Default 50 items per page

            # Get all suggestions with pagination
            suggestions = SuggestionModel.objects.all().order_by("name")
            paginator = Paginator(suggestions, page_size)
            page_obj = paginator.get_page(page)

            serializer = SuggestionSerializer(page_obj, many=True)
            suggestions_data = serializer.data

            return Response(
                {
                    "results": suggestions_data,
                    "pagination": {
                        "page": page,
                        "page_size": page_size,
                        "total_pages": paginator.num_pages,
                        "total_count": paginator.count,
                        "has_next": page_obj.has_next(),
                        "has_previous": page_obj.has_previous(),
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve suggestions: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@sync_to_async
def get_suggestions_page(page, page_size):
    suggestions = SuggestionModel.objects.all().order_by("name")
    paginator = Paginator(suggestions, page_size)
    page_obj = paginator.get_page(page)
    serializer = SuggestionSerializer(page_obj, many=True)
    return serializer.data, paginator, page_obj


@sync_to_async
def get_user_model(email):
    user_model, created = UserModel.objects.get_or_create(
        email=email,
        defaults={
            "name": email.split("@")[0],
            "basic_information": {},
            "interests": [],
            "goals": [],
            "saved_items": [],
            "finished_onboarding": False,
        },
    )
    return user_model


@sync_to_async
def get_all_suggestions_cache():
    return list(SuggestionsCacheModel.objects.all().values())


@sync_to_async
def add_suggestion_cache(user_model, suggestion_ids):
    SuggestionsCacheModel.objects.update_or_create(
        basic_information=user_model.basic_information,
        interests=user_model.interests,
        goals=user_model.goals,
        other_goals=user_model.other_goals,
        defaults={"suggestion_ids": suggestion_ids},
    )


@sync_to_async
def get_saved_items(email):
    try:
        user_model = UserModel.objects.get(email=email)
        return set(user_model.saved_items)
    except UserModel.DoesNotExist:
        return set()


class PersonalizedSuggestionsView(ADRFAPIView):
    permission_classes = [IsAuthenticated]

    def _sort_suggestions(self, s):
        return s["score"]

    async def get(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            page = int(request.GET.get("page", 1))
            page_size = int(request.GET.get("page_size", 50))
            suggestions_data, paginator, page_obj = await get_suggestions_page(
                page, page_size
            )

            suggestions_data = list[Any](suggestions_data)
            user_model = await get_user_model(user.email)

            suggestionsCache = await get_all_suggestions_cache()
            suggestionCache = list[Any](
                filter(
                    lambda cache: cache["interests"] == user_model.interests
                    and cache["basic_information"] == user_model.basic_information
                    and cache["goals"] == user_model.goals
                    and cache["other_goals"] == user_model.other_goals,
                    suggestionsCache,
                )
            )

            if suggestionCache and len(suggestionCache) > 0:
                suggestionCache = suggestionCache[0]
                ranked_suggestions = []
                for suggestion_id in suggestionCache["suggestion_ids"]:
                    for s in suggestions_data:
                        if s["external_id"] == suggestion_id:
                            ranked_suggestions.append(s)
                            break

                return Response(
                    {
                        "results": ranked_suggestions,
                        "pagination": {
                            "page": page,
                            "page_size": page_size,
                            "total_pages": paginator.num_pages,
                            "total_count": paginator.count,
                            "has_next": page_obj.has_next(),
                            "has_previous": page_obj.has_previous(),
                        },
                    },
                    status=status.HTTP_200_OK,
                )

            api_key = os.environ.get("OPENAI_API_KEY")
            client = AsyncOpenAI(api_key=api_key)

            completion = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_RULES},
                    {
                        "role": "user",
                        "content": json.dumps(
                            {
                                "basic_info": user_model.basic_information,
                                "interests": user_model.interests,
                                "goals": user_model.goals,
                                "additional_info": user_model.other_goals,
                                "suggestions": suggestions_data,
                            }
                        ),
                    },
                ],
                response_format={"type": "json_schema", "json_schema": RANKING_SCHEMA},
                timeout=20_000,
                temperature=0.2,
            )
            content = completion.choices[0].message.content
            content = json.loads(content)
            content["suggestions"] = sorted(
                content["suggestions"], key=self._sort_suggestions, reverse=True
            )
            ranked_suggestions = []
            added_external_ids = []
            for suggestion in content["suggestions"]:
                # Skip if we've already added this suggestion
                if suggestion["external_id"] in added_external_ids:
                    continue

                for s in suggestions_data:
                    if s["external_id"] == suggestion["external_id"]:
                        ranked_suggestions.append(s)
                        added_external_ids.append(suggestion["external_id"])
                        break

            saved_items = await get_saved_items(user.email)
            for suggestion in ranked_suggestions:
                suggestion["is_saved"] = suggestion["external_id"] in saved_items

            # Add the data to the cache
            if len(added_external_ids) > 0:
                await add_suggestion_cache(user_model, added_external_ids)

            return Response(
                {
                    "results": ranked_suggestions,
                    "pagination": {
                        "page": page,
                        "page_size": page_size,
                        "total_pages": paginator.num_pages,
                        "total_count": paginator.count,
                        "has_next": page_obj.has_next(),
                        "has_previous": page_obj.has_previous(),
                    },
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"status": "error", "message": f"Failed to retrieve suggestions: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SuggestionDetailView(APIView):
    """Suggestion Detail View"""

    permission_classes = [AllowAny]

    def get(self, request, external_id):
        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
            serializer = SuggestionSerializer(suggestion)
            return Response(
                {
                    "suggestion": serializer.data,
                    "is_saved": False,
                },
                status=status.HTTP_200_OK,
            )

        # Handle suggestion not found
        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "error", "message": "Suggestion not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Other exceptions
        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve suggestion: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SuggestionDetailWithSavedStatusView(APIView):
    """Suggestion Detail View with saved status for authenticated users"""

    permission_classes = [IsAuthenticated]

    def get(self, request, external_id):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {"status": "error", "message": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
            user_model = UserModel.objects.get(email=user.email)
            saved_items = set(user_model.saved_items)
            is_saved = external_id in saved_items
            serializer = SuggestionSerializer(suggestion)

            return Response(
                {
                    "suggestion": serializer.data,
                    "is_saved": is_saved,
                },
                status=status.HTTP_200_OK,
            )

        except SuggestionModel.DoesNotExist:
            return Response(
                {"status": "error", "message": "Suggestion not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": "Failed to retrieve suggestion: " + str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
