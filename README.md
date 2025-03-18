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
  3. Create the minikube tunnel and visit the website: `minikube service hike-app-service`

Troubleshooting while inside the nodejs container:
```
  POD=
  k exec -it $POD -- /bin/bash
  apt-get update
  apt-get install curl -y
  curl localhost:3000
  curl localhost:3000/hikes
```

Troubleshooting while inside the mysql container:
```
  POD=
  k exec -it $POD -- /bin/bash
  PODIP=10.244.0.18
  curl http://$PODIP:3000
  curl http://$PODIP:3000/hikes
```

Developing the kube objects
```
HASH=2ebe0fe # I use the git log hash but you can use any version numbering scheme
echo $HASH
sudo docker build -t hike-app:$HASH -f Dockerfile-kube .
docker tag hike-app:$HASH khadijahthegreat/hike-app:$HASH
docker push khadijahthegreat/hike-app:$HASH
k delete deployment.apps/hike-app-deployment services/hike-app-service
k create -f hike-app.yaml 
k get all
k logs pod/hike-app-deployment-7d4c685969-4v942
minikube ip
k get nodes -o wide
minikube service hike-app-service
```
