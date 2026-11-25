#!/bin/sh
set -eu

cd "$(dirname "$0")"
docker compose pull blog
docker compose up -d --wait blog
