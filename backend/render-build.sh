#!/bin/bash

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Migrating database..."
python manage.py migrate

echo "Running server..."
gunicorn pathfinder_api.wsgi:application --bind 0.0.0.0:8000 --preload --timeout 120

echo "Server running on port 8000"