# NodeJS App
This sample application uses the [Express](https://expressjs.com/) framework and mysql to build a basic web application with a database. This application allows users to record hiking logs.

This source bundle can be deployed to Elastic Beanstalk by following this blog

Run using docker containers:
  1. Ensure you have docker running: `docker -v`
  2. Create the containers and deploy the app: `sudo docker-compose up  `
  3. Visit the website running locally on your machine at [http://localhost:3000/hikes](http://localhost:3000/hikes). You can enter in a hike and have the information recorded in the database

Run using minikube:
  1. Ensure you have created a cluster with minikube
  2. Create the kubernetes objects:
  ```
  k create -f mysql-deploy.yaml
  k create -f mysql-service.yaml
  k create -f hike-app.yaml
  ```


