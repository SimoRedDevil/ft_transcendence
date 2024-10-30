FROM node:20-bullseye

RUN npm install -g next

WORKDIR /app

COPY package*.json ./


RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
