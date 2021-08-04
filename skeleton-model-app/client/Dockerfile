FROM 958130917597.dkr.ecr.ap-southeast-1.amazonaws.com/node:14.15.5-alpine3.13

COPY . /demo

WORKDIR /demo

RUN yarn install

ENTRYPOINT ["/bin/sh", "-c", "yarn db:setup && yarn start" ]
