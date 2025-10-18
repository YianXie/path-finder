#!/bin/bash

# Exit on error
set -o errexit

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Migrating database..."
python manage.py migrate

echo "Syncing suggestions..."
python manage.py sync_sheet