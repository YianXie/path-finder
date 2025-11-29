# Backend

The backend is a Django REST Framework API that powers PathFinder, providing authentication, data management, and personalized recommendation services for extracurricular opportunities.

## Overview

The backend provides:

-   **RESTful API**: Django REST Framework endpoints for all frontend operations
-   **Authentication**: JWT-based authentication with Google OAuth integration
-   **Recommendation Engine**: AI-powered personalized suggestions using OpenAI and vector search
-   **Data Management**: CRUD operations for opportunities, user profiles, ratings, and reviews
-   **Data Ingestion**: Automated Google Sheets synchronization for opportunity catalog

## Tech Stack

-   **Python 3.11+** - Programming language
-   **Django 5.2+** - Web framework
-   **Django REST Framework 3.16+** - API framework
-   **PostgreSQL** (production) / **SQLite** (development) - Database
-   **FastEmbed** - Text embedding generation for vector search
-   **OpenAI API** - LLM-powered recommendation ranking
-   **JWT** (djangorestframework-simplejwt) - Token-based authentication
-   **Cloudinary** - Media storage (production)
-   **WhiteNoise** - Static file serving (production)

## File Structure

```
backend/
├── accounts/                    # User account management app
│   ├── models.py               # UserProfile model (extends Django User)
│   ├── views.py                # Google OAuth, profile, saved items endpoints
│   ├── serializers.py          # UserProfile serialization
│   ├── urls.py                 # Account-related URL routing
│   └── migrations/             # Database migrations
├── suggestions/                # Opportunities/suggestions app
│   ├── models.py               # SuggestionModel, SuggestionsCacheModel
│   ├── views.py                # List, detail, personalized suggestions endpoints
│   ├── serializers.py          # Suggestion serialization
│   ├── urls.py                 # Suggestion-related URL routing
│   ├── reco_schema.py          # OpenAI JSON schema for ranking
│   └── management/commands/    # Django management commands
│       ├── sync_sheet.py       # Google Sheets data ingestion
│       ├── add_missing_tags.py  # LLM-assisted tag generation
│       └── reco_schema.py       # Recommendation schema utilities
├── social/                     # Social features app
│   ├── models.py               # UserRating model (ratings and reviews)
│   ├── views.py                # Rating and review endpoints
│   ├── serializers.py          # Rating serialization
│   ├── urls.py                 # Social-related URL routing
│   └── migrations/             # Database migrations
├── pathfinder_api/             # Django project configuration
│   ├── settings.py             # Django settings (database, CORS, JWT, etc.)
│   ├── urls.py                 # Root URL configuration
│   ├── utils.py                # Custom exception handlers
│   ├── vectordb.py             # Vector search utilities (FastEmbed integration)
│   ├── wsgi.py                 # WSGI application entry point
│   └── asgi.py                 # ASGI application entry point
├── manage.py                   # Django management script
├── pyproject.toml              # Project dependencies (managed via uv)
├── db.sqlite3                  # SQLite database (development)
├── media/                      # User-uploaded media files
│   └── uploads/                # Rating images
├── staticfiles/                # Collected static files (CSS, JS, images)
├── var/log/                    # Application logs (ingestion, errors)
└── render-build.sh             # Production build script
```

## Django Apps

### 1. Accounts App (`accounts/`)

**Purpose**: User authentication and profile management

**Models**:

-   `UserProfile`: Extends Django User with:
    -   Google OAuth subject ID
    -   Saved items list (JSON field)
    -   Onboarding data (basic_information, interests, goals)
    -   Onboarding completion status

**Key Endpoints**:

-   `POST /accounts/google/` - Google OAuth authentication
-   `GET /accounts/profile/` - Get user profile (authenticated)
-   `POST /accounts/save-item/` - Toggle saved item status
-   `POST /accounts/saved-items/` - Get all saved items
-   `POST /accounts/update-user-information/` - Update onboarding data

### 2. Suggestions App (`suggestions/`)

**Purpose**: Opportunity catalog and recommendation engine

**Models**:

-   `SuggestionModel`: Main opportunity model with:
    -   External ID (unique slug identifier)
    -   Name, category, tags, description
    -   URL and image
    -   Vector embedding field for semantic search
    -   Score for ranking
-   `SuggestionsCacheModel`: Caches personalized recommendations to avoid repeated OpenAI API calls

**Key Endpoints**:

-   `GET /api/suggestions/health/` - Health check
-   `GET /api/suggestions/suggestions/` - List all opportunities (paginated, searchable)
-   `GET /api/suggestions/suggestions/<external_id>/` - Opportunity detail
-   `GET /api/suggestions/personalized-suggestions/` - AI-powered personalized feed (authenticated)
-   `GET /api/suggestions/suggestions-with-saved-status/<external_id>/` - Detail with saved status (authenticated)

**Features**:

-   **Vector Search**: Semantic search using FastEmbed embeddings
-   **Personalized Ranking**: OpenAI GPT-4o-mini ranks suggestions based on user profile
-   **Caching**: Recommendations cached by user profile to reduce API costs
-   **Pagination**: All list endpoints support pagination

### 3. Social App (`social/`)

**Purpose**: User ratings and reviews

**Models**:

-   `UserRating`: User reviews for opportunities with:
    -   Rating (1-5 stars)
    -   Optional comment text
    -   Optional uploaded image
    -   Timestamp

**Key Endpoints**:

-   `POST /api/social/rate/` - Create or update a rating/review (authenticated)
-   `GET /api/social/reviews/?external_id=<id>` - Get all reviews for an opportunity
-   `GET /api/social/user-review/` - Get current user's review for an opportunity

### 4. PathFinder API (`pathfinder_api/`)

**Purpose**: Django project configuration and utilities

**Key Files**:

-   `settings.py`:
    -   Database configuration (SQLite dev, PostgreSQL prod)
    -   CORS settings for frontend integration
    -   JWT authentication configuration
    -   Static/media file handling
    -   Environment-based settings (dev vs prod)
-   `vectordb.py`:
    -   FastEmbed model loading (lazy singleton pattern)
    -   Vector field implementation for Django models
    -   Vector search utilities (cosine distance calculation)
-   `utils.py`: Custom exception handlers for DRF
-   `urls.py`: Root URL routing to all apps

## Database Models

### UserProfile

-   One-to-one relationship with Django User
-   Stores user preferences, saved items, onboarding data
-   Google OAuth integration via `google_sub` field

### SuggestionModel

-   Core opportunity data model
-   Vector embedding field for semantic search
-   JSON fields for flexible category and tag storage

### UserRating

-   Many-to-one relationships with UserProfile and SuggestionModel
-   Supports text comments and image uploads
-   Validates rating range (1-5)

### SuggestionsCacheModel

-   Caches personalized recommendations
-   Keyed by user profile attributes (interests, goals, etc.)
-   Reduces OpenAI API calls for repeat requests

## API Authentication

The API uses JWT (JSON Web Tokens) for authentication:

-   **Token Endpoints**:

    -   `POST /api/token/` - Obtain access and refresh tokens
    -   `POST /api/token/refresh/` - Refresh access token

-   **Token Lifetime**:

    -   Access token: 30 minutes
    -   Refresh token: 7 days

-   **Authentication Methods**:

    -   JWT Bearer tokens (primary)
    -   Session authentication (fallback)

-   **Google OAuth**: Custom endpoint at `/accounts/google/` validates Google ID tokens and creates/updates user accounts

## Recommendation System

### Personalized Suggestions Flow

1. **User Profile Retrieval**: Get user's interests, goals, and basic information
2. **Cache Check**: Look for existing recommendations matching user profile
3. **OpenAI Ranking** (if no cache):
    - Send user profile + all suggestions to GPT-4o-mini
    - Use structured JSON schema for consistent ranking
    - Receive scored suggestions (top 20)
4. **Cache Storage**: Save ranked suggestions for future requests
5. **Response**: Return paginated, scored suggestions with saved status

### Vector Search

-   Uses FastEmbed to generate text embeddings
-   Stores embeddings in `SuggestionModel.embedding` field
-   Calculates cosine distance for semantic similarity
-   Returns top 50 most similar items for search queries

## Management Commands

Run from `backend/` directory with virtual environment activated:

### `sync_sheet`

```bash
python manage.py sync_sheet
```

-   Ingests opportunities from configured Google Sheet
-   Creates/updates `SuggestionModel` instances
-   Generates embeddings for new items
-   Logs operations to `var/log/`

### `add_missing_tags`

```bash
python manage.py add_missing_tags
```

-   Uses OpenAI to generate tags for opportunities missing tags
-   Backfills tag data for better searchability

## Development

### Prerequisites

-   Python 3.11+ (up to 3.13)
-   [uv](https://github.com/astral-sh/uv) package manager

### Setup

1. Install uv:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Create virtual environment and install dependencies:

```bash
cd backend
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv sync
```

3. Create `.env` file (see Environment Variables section)

4. Run migrations:

```bash
python manage.py migrate
```

5. Create superuser (optional):

```bash
python manage.py createsuperuser
```

6. Start development server:

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Django Settings
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development  # or "production"
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173

# Database (optional in development - defaults to SQLite)
DATABASE_URL=postgres://username:password@localhost:5432/pathfinder

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
ALLOWED_GOOGLE_HD=sas.edu.sg  # Restrict to SAS domain

# OpenAI (for recommendations)
OPENAI_API_KEY=sk-your-openai-key

# Google Sheets (for data ingestion)
SHEET_ID=your-google-sheet-id

# Cloudinary (for production media storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Production Deployment

### Database

-   Uses PostgreSQL in production (configured via `DATABASE_URL`)
-   SQLite used only in development

### Static Files

-   Collected via `python manage.py collectstatic`
-   Served via WhiteNoise in production
-   Media files stored in Cloudinary

### Security

-   HTTPS enforced in production
-   Secure cookies (SESSION_COOKIE_SECURE, CSRF_COOKIE_SECURE)
-   HSTS headers enabled
-   CORS restricted to allowed origins

### Build Script

The `render-build.sh` script handles production deployment:

-   Installs dependencies via uv
-   Runs migrations
-   Collects static files

## Code Quality

The project uses several tools for code quality:

-   **Ruff**: Fast Python linter and formatter
-   **isort**: Import sorting
-   **Bandit**: Security linting
-   **Safety**: Dependency vulnerability scanning

Configuration in `pyproject.toml`.

## Logging

Application logs are written to `var/log/` directory:

-   Ingestion logs from management commands
-   Timestamped log files for debugging
-   Created automatically at runtime

## API Documentation

When `DEBUG=True`, Django REST Framework provides browsable API documentation at:

-   `http://localhost:8000/api/suggestions/` (example endpoint)

Use the browsable API interface to explore endpoints and test requests.
