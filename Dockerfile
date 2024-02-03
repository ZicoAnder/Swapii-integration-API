FROM node:14

WORKDIR /code

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm install

RUN npm run build-ts

COPY . /code

CMD ["node", "dist/server.js"]