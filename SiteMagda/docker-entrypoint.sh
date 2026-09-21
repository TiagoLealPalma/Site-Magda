#!/usr/bin/env sh
set -e

# The staticfiles volume outlives image rebuilds and hides what the build
# collected, so refresh it on every start or new static assets never show up.
python manage.py collectstatic --noinput
python manage.py migrate --noinput

exec "$@"
