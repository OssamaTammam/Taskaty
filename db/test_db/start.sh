#!/bin/bash

# Bash script to start dev mysql database

# Pull the docker image
docker pull mysql:9.0.0

# Build the docker image
docker build -t my-mysql-container .

# Run the container
docker run -d -p 3306:3306 --name test-db my-mysql-container
