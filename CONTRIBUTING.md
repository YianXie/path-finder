# Contributing to PathFinder

Thank you for your interest in contributing to PathFinder! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites

-   Python 3.11 or higher
-   Node.js 18 or higher
-   PostgreSQL (for local development)

### Quick Start

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd path-finder
    ```

2. **Set up the backend**

    ```bash
    cd backend
    python -m venv env
    source env/bin/activate  # On Windows: env\Scripts\activate
    pip install -r requirements-dev.txt
    python manage.py migrate
    ```

3. **Set up the frontend**

    ```bash
    cd ../frontend
    npm install
    ```

4. **Run the development servers**

    ```bash
    # Backend (in one terminal)
    cd backend
    python manage.py runserver

    # Frontend (in another terminal)
    cd frontend
    npm run dev
    ```

## Code Quality Standards

### Before Submitting Code

Run our CI checks locally to ensure your code meets our standards:

```bash
# Run all CI checks
make ci-local

# Or use the script directly
./scripts/ci-local.sh
```

### Code Formatting

-   **Backend**: Use Black for formatting and isort for import sorting
-   **Frontend**: Use Prettier for formatting

```bash
# Format all code
make format
```

### Linting

We use several linting tools to maintain code quality:

-   **Backend**: flake8, Black, isort
-   **Frontend**: ESLint, Prettier

```bash
# Run linting
make lint
```

### Testing

-   **Backend**: Django test suite with comprehensive API tests
-   **Frontend**: Build verification

```bash
# Run tests
make test
```

### Security

Security checks are run automatically in CI:

-   **Backend**: Safety (dependency vulnerabilities), Bandit (security linting)
-   **Frontend**: npm audit

```bash
# Run security checks
make security
```

## Pull Request Process

1. **Create a feature branch**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Make your changes**

    - Write tests for new functionality
    - Update documentation if needed
    - Ensure all CI checks pass

3. **Run local checks**

    ```bash
    make ci-local
    ```

4. **Commit your changes**

    ```bash
    git add .
    git commit -m "Add: brief description of changes"
    ```

5. **Push and create a Pull Request**
    ```bash
    git push origin feature/your-feature-name
    ```

## GitHub Actions CI

Our CI pipeline runs automatically on:

-   Every push to `main`
-   Every pull request

### CI Jobs

1. **Backend Tests**: Django test suite with PostgreSQL
2. **Frontend Checks**: ESLint, Prettier, and build verification
3. **Backend Linting**: Code quality checks
4. **Security Checks**: Vulnerability scanning

### PR Checks

Additional checks for pull requests:

-   Test coverage reporting
-   Dependency vulnerability review

## Environment Variables

For local development, create a `.env` file in the backend directory:

```bash
# backend/.env
SECRET_KEY=your-secret-key
ENVIRONMENT=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GOOGLE_CLIENT_ID=your-google-client-id
ALLOWED_GOOGLE_HD=your-allowed-domain
SHEET_ID=your-google-sheet-id
```

## Project Structure

```
path-finder/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication
│   ├── suggestions/        # Core functionality
│   ├── pathfinder_api/     # Django project settings
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/               # Source code
│   └── package.json       # Node.js dependencies
├── .github/               # GitHub Actions workflows
├── scripts/               # Utility scripts
└── Makefile              # Development commands
```

## Getting Help

-   Check the [GitHub Issues](https://github.com/your-repo/issues) for known problems
-   Run `make help` to see available commands
-   Review the [GitHub Actions README](.github/README.md) for CI documentation

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to create a welcoming environment for all contributors.

## License

By contributing to PathFinder, you agree that your contributions will be licensed under the MIT License.
