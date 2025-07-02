# PATIENT-MANAGER

Sample app for a patient management system.

## How to build

The project has a github pipeline, it's triggered on every push on branch and on master it also builds the docker image
referenced in the docker compose file.

## How to run

Inside the `deploy` folder, run the script `run.sh`. It will download and execute the spring boot app along with minio
container used as a file storage.
Note that you have to set four environment variables in your OS, the `BLOB_DB_USERNAME` and `BLOB_DB_PASSWORD` for the
minIO blob storage, and `PATIENT_DB_USERNAME` and `PATIENT_DB_PASSWORD` for the patient manager database.

## Local testing

You can run the spring boot application locally after you have run the script `run-local-env.sh` that will run an instance of
minIO locally and a fresh mysql instance with all the tables initialized with sample values.