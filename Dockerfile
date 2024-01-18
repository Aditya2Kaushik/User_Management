# Use an official Node.js runtime as a base image
FROM node:21.6.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY ./app/package*.json ./

# Install app dependencies
RUN npm install

# Bundle your app source code into the container
COPY ./app .

ENV NODE_ENV = production

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your application
CMD ["node", "index.js"]
