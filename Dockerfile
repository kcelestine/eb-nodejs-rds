# Stage 1: Build the app using an official Node image
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the application dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Stage 2: Create a smaller image to run the app
FROM node:16-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Expose the port that the app will run on
EXPOSE 3000

# Run the app
#CMD ["npm", "start"]
#CMD ["sleep", "infinity"]

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Run the wait-for-it command to wait for MySQL before starting the Node.js app
CMD /wait-for-it.sh mysql:3306 -- npm start