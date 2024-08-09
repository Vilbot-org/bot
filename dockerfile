ARG NODE_VERSION=20.12

FROM node:${NODE_VERSION}-bookworm-slim as base

RUN apt-get update && \
    apt-get install -y python3 make build-essential ffmpeg ca-certificates &&\
    apt-get clean &&\
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
ENV DB_URI=empty
ENV DB_NAME=empty
ENV GUILD_ID=12345

COPY package*.json ./
COPY --from=build /vilbot/node_modules ./node_modules
COPY --from=build /vilbot/dist ./dist
RUN echo "APP_NAME=vilbot" >> .env && \
    echo "APP_ENV=production" >> .env && \
    echo "DISCORD_TOKEN=${DISCORD_TOKEN}" >> .env && \
    echo "CLIENT_ID=${CLIENT_ID}" >> .env && \
    echo "GUILD_ID=${GUILD_ID}" >> .env && \
    echo "DB_URI=${DB_URI}" >> .env && \
    echo "DB_NAME=${DB_NAME}" >> .env && \
    echo "SOCKET_URL=${SOCKET_URL}" >> .env && \
    echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> .env

RUN apt-get purge -y python3 && apt-get autoremove -y

CMD ["npm", "run", "start"]
