# Use the official Node.js image from the Docker Hub
FROM node:14

# Create app directory
WORKDIR /Users/kenny/market-stock/aidov.top/express

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app using npm
CMD ["npm", "start"]

