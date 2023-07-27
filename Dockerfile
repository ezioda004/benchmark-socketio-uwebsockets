FROM ubuntu:22.04

# Install dependencies

RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_20.x  | bash -
RUN apt-get -y install nodejs
RUN npm ci

COPY . /app
