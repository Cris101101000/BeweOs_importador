FROM node:24-alpine
LABEL name=login version=latest

WORKDIR /app

# Copy the pre-compiled dist folder and server.js
COPY dist ./dist
COPY server.js ./
COPY package.json ./

# Copy node_modules directly since we're not running npm install
# Note: This assumes node_modules is already present in the build context
COPY node_modules ./node_modules

USER node

CMD [ "node", "server.js" ]