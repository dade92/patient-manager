# PATIENT-MANAGER

Sample app for a patient management system.

## How to build

The project has a github pipeline, it's triggered on every push on branch and on master it also builds the docker image
referenced in the docker compose file.

## How to run

Inside the `deploy` folder, run the script `run.sh`. It will download and execute the spring boot app along with minio
container used as a file storage.
Note that you have to set two environment variables in your OS, the `BLOB_DB_USERNAME` and `BLOB_DB_PASSWORD`.