import json
import os

import rest_framework.exceptions as errors
from asgiref.sync import sync_to_async
from openai import AsyncOpenAI
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.paginator import Paginator
from django.db.models import Case, When

from accounts.models import UserProfile
from pathfinder_api.vectordb import get_embedding, vector_search
from social.models import UserRating
from suggestions.models import SuggestionModel, SuggestionsCacheModel
from suggestions.reco_schema import RANKING_SCHEMA, SYSTEM_RULES
from suggestions.serializers import SuggestionSerializer


def search_suggestions(query):
    emb = get_embedding(query)
    items = vector_search(SuggestionModel, emb)[:50]
    items = [item for item, dist in items] # Add if dist < threshold for threshold
    return items


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
        user = request.user if request.user.is_authenticated else None

        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 50))  # Default 50 items per page

        query = request.GET.get("query", "").lower()

        # Get suggestions
        if query:
            suggestions = search_suggestions(query)
        else:
            suggestions = get_all_suggestions()

        # Paginate
        paginator = Paginator(suggestions, page_size)
        page_obj = paginator.get_page(page)

        # Serialize
        serializer = SuggestionSerializer(page_obj.object_list, many=True)
        suggestions_data = serializer.data

        if user:
            saved_items = get_saved_items_sync(user)

            for suggestion in suggestions_data:
                suggestion["is_saved"] = suggestion["external_id"] in saved_items

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
            }
        )


def get_all_suggestions():
    qs = SuggestionModel.objects.all().order_by("name").values()
    return list(qs)


def get_suggestions():
    suggestions = SuggestionModel.objects.all().order_by("name")
    serializer = SuggestionSerializer(suggestions, many=True)
    return serializer.data


@sync_to_async
def get_async_suggestions():
    suggestions = SuggestionModel.objects.all().order_by("name")
    serializer = SuggestionSerializer(suggestions, many=True)
    return serializer.data


def get_pagination_data(data, page, page_size):
    # Ensure data is a list or queryset
    if hasattr(data, "all"):  # queryset
        data_list = list(data)
    else:
        data_list = data

    paginator = Paginator(data_list, page_size)
    page_obj = paginator.get_page(page)

    # Use ModelSerializer with model instances
    serializer = SuggestionSerializer(page_obj.object_list, many=True)
    pagination_data = serializer.data

    return pagination_data, paginator, page_obj


def get_user_model_sync(user):
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


def get_all_suggestions_cache_sync():
    return list(SuggestionsCacheModel.objects.all().values())


def add_suggestion_cache_sync(user_model, suggestions):
    SuggestionsCacheModel.objects.update_or_create(
        basic_information=user_model.basic_information,
        interests=user_model.interests,
        goals=user_model.goals,
        other_goals=user_model.other_goals,
        defaults={"suggestions": suggestions},
    )


def get_saved_items_sync(user):
    try:
        user_model = UserProfile.objects.get(user=user)
        return set(user_model.saved_items)
    except UserProfile.DoesNotExist:
        return set()


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
def get_saved_items(user):
    try:
        user_model = UserProfile.objects.get(user=user)
        return set(user_model.saved_items)
    except UserProfile.DoesNotExist:
        return set()


class PersonalizedSuggestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 50))

        # Get all suggestions
        suggestions_data = get_suggestions()
        user_model = get_user_model_sync(user)
        saved_items = get_saved_items_sync(user)

        # Check cached suggestions
        suggestions_cache = get_all_suggestions_cache_sync()
        suggestion_cache = list(
            filter(
                lambda cache: cache["interests"] == user_model.interests
                and cache["basic_information"] == user_model.basic_information
                and cache["goals"] == user_model.goals
                and cache["other_goals"] == user_model.other_goals,
                suggestions_cache,
            )
        )

        if suggestion_cache and len(suggestion_cache) > 0:
            ranked_suggestions = suggestion_cache[0]["suggestions"]

            pagination_data, paginator, page_obj = get_pagination_data(ranked_suggestions, page, page_size)

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

        # If no cache, call OpenAI API (still async client)
        api_key = os.environ.get("OPENAI_API_KEY")
        client = AsyncOpenAI(api_key=api_key)

        # Use synchronous run for async OpenAI call
        import asyncio

        completion = asyncio.run(
            client.chat.completions.create(
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
        )

        content = json.loads(completion.choices[0].message.content)

        # Merge scores
        ranked_suggestions = []
        for s in suggestions_data:
            for suggestion in content["suggestions"][:20]:
                if s["external_id"] == suggestion["external_id"]:
                    s["score"] = suggestion["score"]
                    break
            ranked_suggestions.append(s)

        # Add to cache
        add_suggestion_cache_sync(user_model, ranked_suggestions)

        pagination_data, paginator, page_obj = get_pagination_data(ranked_suggestions, page, page_size)
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


class PersonalizedSuggestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        page = int(request.GET.get("page", 1))
        page_size = int(request.GET.get("page_size", 50))

        # Get all suggestions
        suggestions_data = get_suggestions()
        user_model = get_user_model_sync(user)
        saved_items = get_saved_items_sync(user)

        # Check cached suggestions
        suggestions_cache = get_all_suggestions_cache_sync()
        suggestion_cache = list(
            filter(
                lambda cache: cache["interests"] == user_model.interests
                and cache["basic_information"] == user_model.basic_information
                and cache["goals"] == user_model.goals
                and cache["other_goals"] == user_model.other_goals,
                suggestions_cache,
            )
        )

        if suggestion_cache and len(suggestion_cache) > 0:
            ranked_suggestions = suggestion_cache[0]["suggestions"]

            pagination_data, paginator, page_obj = get_pagination_data(ranked_suggestions, page, page_size)

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

        # If no cache, call OpenAI API (still async client)
        api_key = os.environ.get("OPENAI_API_KEY")
        client = AsyncOpenAI(api_key=api_key)

        # Use synchronous run for async OpenAI call
        import asyncio

        completion = asyncio.run(
            client.chat.completions.create(
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
        )

        content = json.loads(completion.choices[0].message.content)

        # Merge scores
        ranked_suggestions = []
        for s in suggestions_data:
            for suggestion in content["suggestions"][:20]:
                if s["external_id"] == suggestion["external_id"]:
                    s["score"] = suggestion["score"]
                    break
            ranked_suggestions.append(s)

        add_suggestion_cache_sync(user_model, ranked_suggestions)

        pagination_data, paginator, page_obj = get_pagination_data(ranked_suggestions, page, page_size)
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
