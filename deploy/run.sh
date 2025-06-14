#!/bin/bash

docker compose up -d minio
sleep 2

docker compose pull app
docker compose up -d app
echo "App should be up and running now!"