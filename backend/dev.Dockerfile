FROM node:24
WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm install
RUN npm install -g nodemon

USER node
ENTRYPOINT ["nodemon", "index.js"]