ARG NODE_VERSION=20.10
FROM node:${NODE_VERSION} as base

RUN apt-get update && \
    apt-get purge -y --auto-remove && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /vilbot

FROM base as build

COPY . .
RUN npm ci
RUN npm run build

RUN rm -rf node_modules && \
	npm ci --omit=dev

FROM node:${NODE_VERSION} as prod

COPY package*.json ./
COPY --from=build /vilbot/node_modules ./node_modules
COPY --from=build /vilbot/dist ./dist
COPY .env ./

CMD ["node", "./dist/index.js"]
