###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine AS development
# RUN npm install -g pnpm
# RUN apk add python3 make g++
# # Set environment variable for Python
# ENV PYTHON /usr/bin/python3
WORKDIR /usr/src/app
RUN apk add build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./
# RUN pnpm fetch --prod

# COPY --chown=node:node . .
RUN yarn

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM --platform=linux/amd64 node:16-alpine As build
WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:16-alpine As production

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
