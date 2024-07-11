FROM node:22.4.1-alpine3.19

# Create app directory
RUN mkdir -p /home/backend/app/node_modules && chown -R node:node /home/backend/app
WORKDIR /home/backend/app

# Install app dependencies
COPY --chown=node:node package*.json ./
USER node
RUN npm install

# Copy app source code
COPY --chown=node:node . .

# Copy .env file
COPY --chown=node:node .env .

# Expose port and start the application
EXPOSE 3001
CMD ["npm", "run", "start"]
