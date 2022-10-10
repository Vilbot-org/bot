FROM node:16.15

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

CMD ["node", "index.js"]