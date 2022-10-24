FROM node:lts AS dist
COPY package.json yarn.lock ./

RUN yarn install --network-timeout 1000000

RUN rm -rf tsconfig.build.tsbuildinfo

COPY . ./

RUN yarn build

RUN rm -rf tsconfig.build.tsbuildinfo

FROM node:lts AS node_modules
COPY package.json yarn.lock ./

RUN yarn install --prod --network-timeout 1000000

FROM node:lts

ARG PORT=4000

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --from=dist dist /usr/src/app/dist
COPY --from=node_modules node_modules /usr/src/app/node_modules

COPY . /usr/src/app

EXPOSE 4000

CMD [ "yarn", "start:prod" ]