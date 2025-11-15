#!/bin/bash

# Exit on error
set -o errexit


echo "Installing dependencies..."

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh
# Set path
export PATH="$HOME/.local/bin:$PATH"

# Make venv and install packages
echo "Making venv..."
if [ ! -d ".venv" ]; then uv venv; fi # if venv doesn't exist, create it
source .venv/bin/activate
uv sync

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --no-input

# Migrate database
echo "Migrating database..."
python manage.py makemigrations && python manage.py migrate

# Sync suggestions
echo "Syncing suggestions..."
python manage.py sync_sheet