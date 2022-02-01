FROM node:16
WORKDIR /lib
ADD package.json yarn.lock /lib/

COPY . .
RUN yarn install