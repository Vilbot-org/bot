ARG NODE_VERSION=18.19.1

FROM node:${NODE_VERSION}-slim as base

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

FROM base as prod

ENV DISCORD_TOKEN=empty
ENV CLIENT_ID=empty
ENV CONNECTION_DB=empty
ENV SOCKET_URL=empty
ENV JWT_SECRET_KEY=empty

COPY package*.json ./
COPY --from=build /vilbot/node_modules ./node_modules
COPY --from=build /vilbot/dist ./dist
RUN echo "APP_NAME=vilbot" >> .env && \
    echo "APP_ENV=prod" >> .env && \
    echo "DISCORD_TOKEN=${DISCORD_TOKEN}" >> .env && \
    echo "CLIENT_ID=${CLIENT_ID}" >> .env && \
    echo "DP_FORCE_YTDL_MOD=@distube/ytdl-core" >> .env && \
    echo "CONNECTION_DB=${CONNECTION_DB}" >> .env && \
    echo "SOCKET_URL=${SOCKET_URL}" >> .env && \
    echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> .env

CMD ["npm", "run", "start"]
