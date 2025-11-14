#!/bin/bash

# Exit on error
set -o errexit


echo "Installing dependencies..."

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh
# Set path
export PATH="$HOME/.local/bin:$PATH"

# Make venv and install packages
uv venv
source .venv/bin/activate
uv sync

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Migrating database..."
python manage.py makemigrations && python manage.py migrate

echo "Syncing suggestions..."
python manage.py sync_sheet