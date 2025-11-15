#!/bin/bash

# Exit on error
set -e

echo "Installing dependencies..."

mkdir -p .uvbin

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | UV_INSTALL_DIR=".uvbin" sh

# Set path
export PATH="$PATH:$(pwd)/.uvbin"

# Make venv and install packages
echo "Making venv..."
if [ ! -d ".venv" ]; then uv venv; fi # if venv doesn't exist, create it

echo "Activating venv..."
source .venv/bin/activate

echo "Syncing dependencies..."
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