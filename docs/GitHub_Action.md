# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for continuous integration (CI) and deployment.

## Workflows

### CI (`ci.yml`)

Runs on every push to `main` and on pull requests. Includes:

-   **Backend Tests**: Django test suite with PostgreSQL
-   **Frontend Checks**: ESLint, Prettier formatting, and build verification
-   **Backend Linting**: Ruff and isort code quality checks
-   **Security Checks**: Safety and Bandit for Python, npm audit for Node.js

### PR Checks (`pr-checks.yml`)

Additional checks for pull requests:

-   **Test Coverage**: Generates and uploads test coverage reports
-   **Dependency Review**: Checks for security vulnerabilities in dependencies

## Local Development

You can run the same checks locally using the provided scripts:

### Using the Makefile

```bash
# Install all dependencies
make install

# Run all CI checks
make ci-local

# Run individual checks
make test      # Run tests only
make lint      # Run linting only
make format    # Format code
make security  # Run security checks
```

### Using the script directly

```bash
# Make the script executable (first time only)
chmod +x scripts/ci-local.sh

# Run all CI checks
./scripts/ci-local.sh
```

## Configuration Files

-   `backend/pyproject.toml` - Ruff and isort configuration, dependency management via uv
-   `frontend/.prettierignore` - Prettier ignore patterns

> **Note**: The CI workflow generates `requirements.txt` from `pyproject.toml` using `uv export` for Safety vulnerability scanning. This file is not committed to the repository.

## Environment Variables

The CI workflows use the following environment variables for testing:

-   `SECRET_KEY`: Django secret key
-   `ENVIRONMENT`: Set to 'development'
-   `DATABASE_URL`: PostgreSQL connection string
-   `DEBUG`: Set to 'True'
-   `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
-   `CORS_ALLOWED_ORIGINS`: Comma-separated list of CORS origins
-   `GOOGLE_CLIENT_ID`: Google OAuth client ID (test value)
-   `ALLOWED_GOOGLE_HD`: Google hosted domain (test value)
-   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Cloudinary configuration (test values)

See the [Environment Variables section in README.md](../README.md#environment-variables) for more details.

## Adding New Checks

To add new CI checks:

1. Update the appropriate workflow file in `.github/workflows/`
2. Add any new dependencies to `backend/pyproject.toml` (backend) or `frontend/package.json` (frontend)
3. Update the local CI script in `scripts/ci-local.sh`
4. Update this README with documentation

## Troubleshooting

### Common Issues

1. **Tests failing**: Check that all required environment variables are set
2. **Linting errors**: Run `make format` to auto-fix formatting issues
3. **Security warnings**: Review and address any security vulnerabilities found
4. **Build failures**: Ensure all dependencies are properly installed

### Getting Help

If you encounter issues with the CI setup:

1. Check the GitHub Actions logs for detailed error messages
2. Run the local CI script to reproduce issues locally
3. Ensure your local environment matches the CI environment (Python 3.11, Node.js 18)
