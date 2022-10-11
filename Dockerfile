FROM node:16.15.0-alpine as builder

WORKDIR /home/app

COPY package.json /home/app/
COPY yarn.lock /home/app/

RUN yarn install

COPY . /home/app/

RUN yarn build
CMD ["yarn", "start:prod"]

EXPOSE 4000

