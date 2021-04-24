FROM node:10-alpine

WORKDIR /

COPY . .

EXPOSE 5000

RUN npm install

CMD ["npm", "start"]