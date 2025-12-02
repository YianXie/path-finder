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

-   `ENVIRONMENT`="" # the environment where your backend is running, for local development, use 'development'
-   `SECRET_KEY`="" # your Django secret_key, can be re-generated if needed
-   `ALLOWED_HOSTS`="" # your domain (without https:// or http://)
-   `CORS_ALLOWED_ORIGINS`="" # your domain (with https:// or http://)
-   `CSRF_TRUSTED_ORIGINS`="" # your domain (with https:// or http://)
-   `DATABASE_URL`="" # the url to access your PostgreSQL database
-   `CLOUDINARY_CLOUD_NAME`="" # Your Cloudinary Cloud Name, can be found on the Cloudinary website
-   `CLOUDINARY_API_KEY`="" # Your Cloudinary API Key, can be found on the Cloudinary website
-   `CLOUDINARY_API_SECRET`="" # Your Cloudinary API Secret, can be found on the Cloudinary website
-   `GOOGLE_CLIENT_ID`="" # your Google Client ID for google login (should match with frontend)
-   `ALLOWED_GOOGLE_HD`="" # (optional) only allow specific email address domain to login (e.g., your-company.com)
-   `SHEET_ID`="" # the Google Spreadsheet ID, can be found in the url of the sheet, sheet must be set to publicly visible
-   `OPENAI_API_KEY`="" # your OpenAI API Key, can be found on the OpenAI website

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
