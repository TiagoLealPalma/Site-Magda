FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Build-time defaults so `collectstatic` (which never touches the DB or
# secrets) doesn't require real env vars to be present at build time.
ENV SECRET_KEY=build-time-only \
    DEBUG=False
RUN python manage.py collectstatic --noinput

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["gunicorn", "SiteMada.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
