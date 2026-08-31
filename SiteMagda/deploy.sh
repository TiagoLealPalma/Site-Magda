#!/usr/bin/env bash
# Runs ON THE VPS (called manually the first time, then by the GitHub
# Actions workflow on every push to `deploy`). Not meant to run locally.
set -euo pipefail

cd "$(dirname "$0")"

git pull
docker compose build
docker compose up -d
docker compose exec -T web python manage.py migrate --noinput

echo "Deploy done: $(date)"
