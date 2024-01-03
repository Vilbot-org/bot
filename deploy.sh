#!/bin/sh
$CONTAINER_NAME="vilbot-transpiler-container"

# Transpiler contianer
docker build -t vilbot-transpiler .
mkdir dist
docker run --name $CONTAINER_NAME vilbot-transpiler
docker cp $CONTAINER_NAME:/app/dist dist/
docker rm $CONTAINER_NAME

# Deploy container
docker build -t Vilbot -f dockerfile.production .
docker run Vilbot

rm -R dist/