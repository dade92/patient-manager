#!/bin/bash

docker compose down app
sleep 2

docker compose pull app

docker compose up -d app