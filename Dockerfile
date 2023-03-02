# syntax=docker/dockerfile:1.4

# Create image based on the official Node image from dockerhub
FROM node:19 AS builder

# Create app directory
WORKDIR /usr/src/app

# Get all the code needed to run the app
COPY . /usr/src/app

# Install dependecies
RUN yarn install

# Build the app
RUN yarn build

FROM node:19-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build /usr/src/app/build
COPY --from=builder /usr/src/app/server.ts /usr/src/app/server.ts

RUN npm install express \
    && npm install socket.io

# Expose the port the app runs in
EXPOSE 8080

# Serve the app
CMD ["node", "server.ts"]
