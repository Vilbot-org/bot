FROM node:20.10

WORKDIR /vilbot

COPY package*.json ./
COPY jsconfig.json ./
COPY src/ ./src/
COPY .env ./

RUN npm ci

RUN npm run build && \
	rm -rf node_modules && \
	rm -rf src && \
	npm ci --omit=dev

CMD ["npm", "run", "start"]
