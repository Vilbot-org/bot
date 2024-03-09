#!/bin/sh

if docker inspect -f '{{.Name}}' vilbot 2>/dev/null; then
	if docker inspect -f '{{.State.Running}}' vilbot 2>/dev/null; then
        	docker stop vilbot
	fi

	docker rm vilbot
fi

docker run --name vilbot -d --restart always gfrancv/vilbot:latest

exit
