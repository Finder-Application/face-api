FROM node:lts-alpine AS dist
WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --network-timeout 1000000

RUN rm -rf tsconfig.build.tsbuildinfo

COPY . ./

RUN yarn build

RUN rm -rf tsconfig.build.tsbuildinfo

FROM node:lts-alpine AS node_modules
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod --network-timeout 1000000

FROM node:lts-alpine
ARG PORT=4000
WORKDIR /app

WORKDIR /usr/src/app
COPY --from=dist app/dist app/dist
COPY --from=node_modules app/node_modules app/node_modules
COPY . /app
EXPOSE 4000
CMD [ "yarn", "start:prod" ]