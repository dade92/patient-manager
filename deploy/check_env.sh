#!/bin/bash

# List of required environment variables
REQUIRED_VARS=(BLOB_DB_USERNAME BLOB_DB_PASSWORD PATIENT_DB_USERNAME PATIENT_DB_PASSWORD)

MISSING=()
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    MISSING+=("$VAR")
  fi
done

if [ ${#MISSING[@]} -ne 0 ]; then
  echo "ERROR: The following required environment variables are missing: ${MISSING[*]}" >&2
  echo "Please set them before running this script." >&2
  exit 1
fi

