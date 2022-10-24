FROM node:lts AS dist
COPY package.json yarn.lock ./


WORKDIR /home/app	RUN yarn install --network-timeout 1000000

RUN rm -rf tsconfig.build.tsbuildinfo
COPY package.json /home/app/
COPY yarn.lock /home/app


RUN yarn install	COPY . ./

COPY . /home/app/


RUN yarn build	RUN yarn build
CMD ["yarn", "start:prod"]


EXPOSE 4000

