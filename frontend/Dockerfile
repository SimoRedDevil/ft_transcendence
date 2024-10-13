FROM node:20-bullseye

WORKDIR /app

RUN npm install -g next

COPY package*.json .

RUN npm install


COPY . .

CMD [ "npm", "run", "dev" ]