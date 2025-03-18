# Stage 1: Build the app using an official Node image
FROM node:16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .

# Stage 2: Create a smaller image to run the app
FROM node:16-slim
WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app
EXPOSE 3000
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Run the wait-for-it command to wait for MySQL before starting the Node.js app
CMD /wait-for-it.sh mysql:3306 -- npm start