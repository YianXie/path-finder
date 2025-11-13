# Contributing to PathFinder

Thank you for your interest in contributing to PathFinder! This guide explains how to set up your environment, follow our workflows, and ship high-quality changes.

## Development Setup

### Prerequisites

-   Python 3.11 or higher
-   Node.js 18+ (Node 20 recommended) and npm
-   Optional: PostgreSQL 15+ if you prefer not to use SQLite during development
-   Access to the SAS Google Workspace OAuth client and OpenAI credentials (for features that depend on them)

### Quick Start

1. **Clone the repository**

    ```bash
    git clone https://github.com/YianXie/path-finder.git
    cd path-finder
    ```

2. **Set up the backend**

    ```bash
    python -m venv .venv
    source .venv/bin/activate  # Windows: .venv\Scripts\activate
    pip install -r backend/requirements.txt
    # Create backend/.env based on the Environment Variables section
    python backend/manage.py migrate
    ```

3. **Set up the frontend**

    ```bash
    cd frontend
    npm install
    # Create .env.local (or .env) based on the Environment Variables section
    cd ..
    ```

4. **Run the development servers**

    ```bash
    # terminal 1 (from the repository root)
    source .venv/bin/activate  # if not already active
    python backend/manage.py runserver

    # terminal 2
    cd path-finder/frontend  # from home directory; omit the prefix if already in the repo
    npm run dev
    ```

The API runs on `http://localhost:8000` and the web app on `http://localhost:5173`.

### One-command installs

Prefer automation? From the repository root:

```bash
make install     # install backend + frontend dependencies
make ci-local    # run the same checks as CI
```

See [Makefile](Makefile) for the full list of commands.

## Code Quality Standards

### Before Submitting Code

Always run our CI-equivalent checks locally:

```bash
make ci-local
# or
./scripts/ci-local.sh
```

### Formatting

-   **Backend**: Ruff formatter (Black-compatible) and isort import ordering
-   **Frontend**: Prettier with Tailwind and import sort plugins

```bash
make format
```

### Linting

-   **Backend**: `ruff check` for linting, security linting via Bandit
-   **Frontend**: ESLint with React and hooks plugins

```bash
make lint
```

### Testing

-   **Backend**: Django test suite (`python backend/manage.py test`)
-   **Frontend**: Vite build verification (`npm run build`)

```bash
make test
```

### Security Checks

-   **Backend**: Safety vulnerability scan, Bandit static analysis
-   **Frontend**: `npm audit`

```bash
make security
```

## Pull Request Process

1. **Create a focused branch**

    ```bash
    git checkout -b feature/my-improvement
    ```

2. **Implement changes**

    - Add or update tests where applicable
    - Update documentation or config changes as needed
    - Keep commits scoped and descriptive

3. **Run local checks**

    ```bash
    make ci-local
    ```

4. **Commit with context**

    ```bash
    git add .
    git commit -m "feat: describe the change"
    ```

5. **Push and open a PR**

    ```bash
    git push origin feature/my-improvement
    ```

In your PR description, summarize the change, list test coverage, and call out any follow-up work.

## GitHub Actions CI

We run CI on every push to `main` and every pull request. Current jobs include:

1. **Backend tests** – Django test suite against PostgreSQL service
2. **Backend linting** – Ruff lint, format check, Bandit
3. **Frontend checks** – ESLint, Prettier format check, Vite build
4. **Security** – Safety scan and dependency review

PRs also report code coverage and dependency alerts when applicable.

## Environment Variables

Configure environment variables before running servers or tests.

**Backend (`backend/.env`):**

```bash
SECRET_KEY=django-insecure-change-me
ENVIRONMENT=development
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=postgres://user:password@localhost:5432/pathfinder  # optional in dev
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
ALLOWED_GOOGLE_HD=sas.edu.sg
OPENAI_API_KEY=sk-your-openai-key
SHEET_ID=your-google-sheet-id
```

**Frontend (`frontend/.env.local` or `.env`):**

```bash
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_ENVIRONMENT=development
```

Never commit secrets—use `.env.local` overrides or your deployment platform’s secret manager.

## Project Structure

```
path-finder/
├── backend/
│   ├── accounts/                # Google OAuth, profile management, saved items
│   ├── social/                  # Ratings and reviews APIs
│   ├── suggestions/             # Suggestion models, ingestion, LLM personalization
│   │   └── management/commands/ # sync_sheet, add_missing_tags, etc.
│   ├── pathfinder_api/          # Django settings, urls, ASGI/WSGI
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── pages/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── scripts/                     # CI helpers
├── Makefile                     # Project-wide tasks
├── .github/                     # GitHub Actions workflows & docs
└── README.md
```

## Getting Help

-   Browse [GitHub Issues](https://github.com/YianXie/path-finder/issues) before filing new ones
-   Run `make help` for available automation commands
-   Check the [GitHub Actions README](.github/README_TEMPLATE.md) for CI details
-   Reach out via [yianxie52@gmail.com](mailto:yianxie52@gmail.com) for urgent support

## Code of Conduct

We strive for a welcoming, collaborative community. Please be respectful and constructive in discussions and reviews.

## License

By contributing to PathFinder you agree that your contributions are provided under the MIT License.
