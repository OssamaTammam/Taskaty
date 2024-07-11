FROM node:22.4.1-alpine3.19

RUN mkdir -p /home/backend/app/node_modules && chown -R node:node /home/backend/app
WORKDIR /home/backend/app

COPY --chown=node:node package*.json ./

USER node
RUN npm install

COPY --chown=node:node . .

RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
