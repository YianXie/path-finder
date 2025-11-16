import json
import os

import rest_framework.exceptions as errors
from adrf.views import APIView as ADRFAPIView
from asgiref.sync import sync_to_async
from openai import AsyncOpenAI
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.paginator import Paginator

from accounts.models import UserProfile
from social.models import UserRating
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
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 50))  # Default 50 items per page

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


@sync_to_async
def get_suggestions():
    suggestions = SuggestionModel.objects.all().order_by("name")
    serializer = SuggestionSerializer(suggestions, many=True)
    return serializer.data


@sync_to_async
def get_pagination_data(data, page, page_size):
    paginator = Paginator(data, page_size)
    page_obj = paginator.get_page(page)
    pagination_data = SuggestionSerializer(page_obj.object_list, many=True).data
    return pagination_data, paginator, page_obj


@sync_to_async
def get_user_model(user):
    user_model, created = UserProfile.objects.get_or_create(
        user=user,
        defaults={
            "name": user.email.split("@")[0],
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
def add_suggestion_cache(user_model, suggestions):
    SuggestionsCacheModel.objects.update_or_create(
        basic_information=user_model.basic_information,
        interests=user_model.interests,
        goals=user_model.goals,
        other_goals=user_model.other_goals,
        defaults={"suggestions": suggestions},
    )


@sync_to_async
def update_suggestion_score(external_id, score):
    SuggestionModel.objects.filter(external_id=external_id).update(score=score)


@sync_to_async
def get_saved_items(user):
    try:
        user_model = UserProfile.objects.get(user=user)
        return set(user_model.saved_items)
    except UserProfile.DoesNotExist:
        return set()


class PersonalizedSuggestionsView(ADRFAPIView):
    permission_classes = [IsAuthenticated]

    async def get(self, request):
        user = request.user

        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 50))
        suggestions_data = await get_suggestions()
        user_model = await get_user_model(user)
        saved_items = await get_saved_items(user)

        suggestionsCache = await get_all_suggestions_cache()
        suggestionCache = list(
            filter(
                lambda cache: cache["interests"] == user_model.interests
                and cache["basic_information"] == user_model.basic_information
                and cache["goals"] == user_model.goals
                and cache["other_goals"] == user_model.other_goals,
                suggestionsCache,
            )
        )

        if suggestionCache and len(suggestionCache) > 0:
            ranked_suggestions = suggestionCache[0]["suggestions"]

            pagination_data, paginator, page_obj = await get_pagination_data(ranked_suggestions, page, page_size)

            for suggestion in pagination_data:
                suggestion["is_saved"] = suggestion["external_id"] in saved_items

            return Response(
                {
                    "results": pagination_data,
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
        content = json.loads(completion.choices[0].message.content)

        ranked_suggestions = []
        for s in suggestions_data:
            for suggestion in content["suggestions"][:20]:
                if s["external_id"] == suggestion["external_id"]:
                    s["score"] = suggestion["score"]
                    break
            ranked_suggestions.append(s)

        # Add the data to the cache
        await add_suggestion_cache(user_model, ranked_suggestions)

        pagination_data, paginator, page_obj = await get_pagination_data(ranked_suggestions, page, page_size)

        for suggestion in pagination_data:
            suggestion["is_saved"] = suggestion["external_id"] in saved_items

        return Response(
            {
                "results": pagination_data,
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
                    "rating": 0,
                },
                status=status.HTTP_200_OK,
            )

        # Handle suggestion not found
        except SuggestionModel.DoesNotExist:
            raise errors.NotFound("Suggestion not found")


class SuggestionDetailWithSavedStatusView(APIView):
    """Suggestion Detail View with saved status for authenticated users"""

    permission_classes = [IsAuthenticated]

    def get(self, request, external_id):
        user = request.user

        try:
            suggestion = SuggestionModel.objects.get(external_id=external_id)
            user_profile = UserProfile.objects.get(user=user)
            saved_items = set(user_profile.saved_items)
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
            raise errors.NotFound("Suggestion not found")
