FROM node:20
EXPOSE 3000

COPY . /admin-interface
WORKDIR /admin-interface

RUN npm ci

ENV CI true
CMD [ "npm", "start" ]
