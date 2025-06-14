#!/bin/bash

cd local-env

docker compose up -d minio
sleep 3

docker compose up -d create-bucket