# PathFinder

PathFinder helps SAS high school students discover extracurricular opportunities—from competitions and clubs to internships and tutoring—tailored to their interests, goals, and past engagement.

## Table of Contents

-   [Overview](#overview)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Backend Setup](#backend-setup)
    -   [Frontend Setup](#frontend-setup)
    -   [Run Both Apps](#run-both-apps)
-   [Environment Variables](#environment-variables)
-   [Developer Tooling](#developer-tooling)
    -   [Makefile Commands](#makefile-commands)
    -   [Management Commands](#management-commands)
-   [API Surface](#api-surface)
    -   [Suggestions](#suggestions)
    -   [Accounts](#accounts)
    -   [Social](#social)
    -   [Auth](#auth)
-   [Current Features](#current-features)
-   [Roadmap](#roadmap)
-   [Support](#support)
-   [License](#license)

### Other README files

-   [GitHub Actions](/docs/GitHub_Action.md)
-   [Connection to the Themes](/docs/Theme_Connection.md)
-   [How to Use This Site](/docs/How_To_Use.md)

## Overview

-   **Personalized discovery**: Uses onboarding data, saved items, and LLM-assisted ranking to tailor recommendations.
-   **Integrated experience**: Google-backed authentication keeps access limited to SAS students and staff.
-   **Feedback loop**: Ratings, reviews, and saved items feed the recommendation engine.
-   **Operations ready**: Automated Google Sheet ingestion keeps the catalog current.

[Production site](https://sas-pathfinder.org)

## Tech Stack

**Backend**

-   Python 3.11, Django 5.2+, Django REST Framework 3.16+
-   Async APIs via `adrf` for personalized recommendations
-   PostgreSQL (prod) and SQLite (local default)
-   Background ingestion via management commands and logging under `backend/var/log`

**Frontend**

-   React 19 with Vite 7 for fast DX
-   React Router 7, Material UI 7, Tailwind CSS 4
-   Axios-powered API client with automatic token refresh

**Tooling & DevOps**

-   Ruff (formatter and linter), isort, Bandit, Safety for Python quality and security
-   ESLint, Prettier, and Tailwind plugins for the frontend
-   Makefile helpers and `scripts/ci-local.sh` to mirror CI locally

## Project Structure

```
path-finder/
├── backend/                     # Django project
│   ├── accounts/                # Google auth + profile APIs
│   ├── social/                  # Ratings and reviews APIs
│   ├── suggestions/             # Suggestion models, serializers, views
│   │   └── management/commands/ # Data ingestion utilities (Google Sheets, tagging)
│   ├── pathfinder_api/          # Django settings, URLs, ASGI/WSGI config
│   ├── var/log/                 # Import logs (created at runtime)
│   ├── manage.py
│   └── pyproject.toml           # Dependencies managed via uv
├── frontend/                    # React single-page app
│   ├── src/
│   │   ├── components/          # UI primitives, layout, shared widgets
│   │   ├── contexts/            # Auth, snackbar, item detail providers
│   │   ├── hooks/               # Data fetching and UX hooks
│   │   └── pages/               # Route-level screens (Home, Onboarding, Saved, etc.)
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── scripts/                     # Local CI helper scripts
├── Makefile                     # Common dev commands
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

-   Python 3.11
-   Node.js 18+ (Node 20 recommended) and npm
-   Google OAuth client configured for the SAS Google Workspace

### Backend Setup

Install UV

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

```bash
cd path-finder/backend
uv venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
uv sync
python manage.py migrate
python manage.py runserver
```

The API listens on `http://localhost:8000`.

Create `backend/.env` following the values listed in [Environment Variables](#environment-variables) before running the server.

### Frontend Setup

```bash
cd path-finder/frontend
npm install
npm run dev
```

The SPA is served from `http://localhost:5173`.

Create `frontend/.env.local` (or `.env`) with the keys in [Environment Variables](#environment-variables) before starting Vite.

### Run Both Apps

Use separate terminals for backend and frontend, or rely on the Makefile:

```bash
cd path-finder
make install        # installs backend + frontend deps
make backend-prod   # optional: run backend with gunicorn
```

For routine development, run `python manage.py runserver` (from `backend/`) and `npm run dev` (from `frontend/`) concurrently.

## Environment Variables

Create a `.env` file in `backend/`:

```bash
SECRET_KEY=django-insecure-change-me
ENVIRONMENT=development
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=postgres://username:password@localhost:5432/pathfinder  # optional in dev
GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
ALLOWED_GOOGLE_HD=sas.edu.sg
OPENAI_API_KEY=sk-your-openai-key
SHEET_ID=your_google_sheet_id
```

Create a `.env.local` (or `.env`) file in `frontend/`:

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
VITE_ENVIRONMENT=development
```

> The backend falls back to SQLite when `ENVIRONMENT=development`. Provide `DATABASE_URL` for production or local Postgres.

## Developer Tooling

### Makefile Commands

-   `make install` – install backend and frontend dependencies
-   `make lint` – run Ruff and frontend ESLint checks
-   `make format` – apply Ruff format, isort, and Prettier
-   `make security` – run Safety and Bandit plus `npm audit`
-   `make test` – execute Django test suite
-   `make ci-local` – replicate CI pipeline locally (`scripts/ci-local.sh`)
-   `make clean` – prune caches and build artifacts

### Management Commands

Run from `backend/` with the virtual environment activated:

-   `python manage.py sync_sheet` – ingest the latest opportunities from the configured Google Sheet (`SHEET_ID`)
-   `python manage.py add_missing_tags` – backfill tags with help from the LLM
-   `python manage.py collectstatic` – prepare static assets for production deployments

Log files for ingestion live under `backend/var/log/`.

## API Surface

### Suggestions

-   `GET /api/suggestions/health/` – service health check
-   `GET /api/suggestions/suggestions/` – paginated list of all opportunities (public)
-   `GET /api/suggestions/suggestions/<external_id>/` – opportunity detail (public)
-   `GET /api/suggestions/personalized-suggestions/` – personalized feed (auth, async)
-   `GET /api/suggestions/suggestions-with-saved-status/<external_id>/` – detail including saved flag (auth)

### Accounts

-   `POST /accounts/google/` – sign-in/up with Google OAuth credential
-   `POST /accounts/parse-token/` – decode an arbitrary JWT (debugging utility)
-   `GET /accounts/profile/` – retrieve enriched profile data (auth)
-   `POST /accounts/save-item/` – toggle saved items (auth)
-   `POST /accounts/check-item-saved/` – check saved state (auth)
-   `POST /accounts/saved-items/` – list saved opportunities (auth)
-   `POST /accounts/update-user-information/` – persist onboarding data (auth)

### Social

-   `POST /api/social/rate/` – create or update a rating/comment for an opportunity (auth)
-   `GET /api/social/reviews/?external_id=<id>` – fetch reviews for an opportunity (public)
-   `GET /api/social/user-review/` – get the current user's review for an opportunity (auth)

### Auth

-   `POST /api/token/` – obtain access + refresh tokens (username/password flow)
-   `POST /api/token/refresh/` – refresh an access token

## Current Features

-   Google-based authentication restricted to SAS email domains
-   Guided onboarding that captures interests, goals, and basic profile data
-   LLM-assisted personalized recommendations with caching for repeat requests
-   Saved items dashboard with optimistic UI updates
-   Ratings and written reviews for each opportunity
-   Light/dark theme toggle and responsive layout

## Support

Questions or issues? Email [yianxie52@gmail.com](mailto:yianxie52@gmail.com) or open a GitHub Issue on this repository.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
