FROM node:lts AS dist
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN yarn 
USER node

FROM node:lts As build
WORKDIR /usr/src/app

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:16-alpine As production
ARG PORT=4000
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD [ "node", "dist/main.js" ]