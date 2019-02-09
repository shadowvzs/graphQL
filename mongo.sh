#!/bin/bash

# settings for all container
WORK_DIR="/home/shadowvzs/projects/graphql/"
DOCKER_NETWORK="mynetwork"

# settings for MongoDB container
EXT_DB_DIR="${WORK_DIR}mongoDB/db"
INT_DB_DIR="/data/db"
EXT_DB_SHELL="${WORK_DIR}mongoDB/start.sh"
INT_DB_SHELL="/home/mongo/start.sh"
DB_CONTAINER_NAME="mongo"
DB_IMAGE="mongo:latest"
DB_PORT="27017"

clear
echo "start mongoDB container..."
sudo docker run --rm -v ${EXT_DB_DIR}:${INT_DB_DIR} -v ${EXT_DB_SHELL}:${INT_DB_SHELL} -it -p ${DB_PORT}:${DB_PORT} --network ${DOCKER_NETWORK} --privileged --name ${DB_CONTAINER_NAME} ${DB_IMAGE} /bin/bash
