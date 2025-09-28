#!/bin/bash

# Check required environment variables before starting
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/check_env.sh"

docker compose up -d minio
docker compose up -d mysql
sleep 2

docker compose pull app
docker compose up -d app
echo "App should be up and running now!"