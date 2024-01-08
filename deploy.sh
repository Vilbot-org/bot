#!/bin/sh
# CONTAINER_NAME="vilbot-transpiler-container"

# # Transpiler contianer
# docker build -t vilbot-transpiler .
# mkdir dist
# docker run --name $CONTAINER_NAME vilbot-transpiler
# docker cp $CONTAINER_NAME:/app/dist dist/
# docker rm $CONTAINER_NAME

# Deploy container
docker build --no-cache -t vilbot -f dockerfile.production .

if docker inspect -f '{{.Name}}' vilbot 2>/dev/null; then
	if docker inspect -f '{{.State.Running}}' vilbot 2>/dev/null; then
        	docker stop vilbot
	fi

	docker rm vilbot
fi

docker run --name vilbot -d --restart always vilbot

exit
