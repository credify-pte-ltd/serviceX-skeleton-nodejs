FROM alpine:3.14

RUN apk add --no-cache yarn

COPY . /demo

WORKDIR /demo

RUN yarn install

ENTRYPOINT ["/bin/sh", "-c", "yarn db:setup && yarn start" ]
