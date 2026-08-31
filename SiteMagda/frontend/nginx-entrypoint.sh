#!/usr/bin/env sh
# Runs automatically at container start via the base nginx image's
# /docker-entrypoint.d/ mechanism (before nginx itself starts) — do not
# `exec nginx` here, the base image's own entrypoint does that afterwards.
#
# Templates live in /etc/nginx/conf-templates/ (NOT /etc/nginx/templates/)
# so the base image's own built-in envsubst-on-templates script doesn't
# also try to render both of them into conf.d at once (which would produce
# two conflicting `listen 80` server blocks).
set -e

if [ "$ENABLE_SSL" = "true" ]; then
  TEMPLATE=/etc/nginx/conf-templates/ssl.conf.template
else
  TEMPLATE=/etc/nginx/conf-templates/local.conf.template
fi

# Only ${DOMAIN} gets substituted (explicit list) so nginx's own runtime
# variables ($uri, $host, $remote_addr, ...) are left untouched.
envsubst '${DOMAIN}' < "$TEMPLATE" > /etc/nginx/conf.d/default.conf
