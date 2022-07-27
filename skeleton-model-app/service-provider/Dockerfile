FROM alpine:3.14

RUN apk add --no-cache yarn

COPY . /demo

WORKDIR /demo

RUN yarn install

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

ENTRYPOINT ["/bin/sh", "-c", "yarn db:setup && yarn start" ]
