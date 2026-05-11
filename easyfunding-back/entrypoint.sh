#!/bin/sh
echo "=== ENV CHECK: SECRET_KEY set=$([ -n "$SECRET_KEY" ] && echo YES || echo NO) ==="
python manage.py migrate --noinput
python manage.py collectstatic --noinput
exec "$@"
