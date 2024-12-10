# Base image
FROM node:20
# Setting work directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
# Install Loglask dependencies
RUN npm install
# Copy source files
COPY . .
# Building app
RUN npx prisma generate
RUN npm run build
# Expose port 3000
EXPOSE 3000
# Start the server
CMD [ "node", "dist/index.js" ]
