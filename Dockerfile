FROM node:lts AS dist
WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install --network-timeout 1000000

RUN rm -rf tsconfig.build.tsbuildinfo

COPY . ./

RUN yarn build

RUN rm -rf tsconfig.build.tsbuildinfo

FROM node:lts AS node_modules
WORKDIR /app
COPY --from=dist app/package.json app/package.json
COPY --from=dist app/yarn.lock app/yarn.lock
RUN yarn install --prod --network-timeout 1000000

FROM node:16-alpine
ARG PORT=4000
WORKDIR /app

WORKDIR /usr/src/app
COPY --from=dist app/dist app/dist
COPY --from=node_modules app/node_modules app/node_modules
COPY . /app
EXPOSE 4000
CMD [ "node", "dist/main" ]