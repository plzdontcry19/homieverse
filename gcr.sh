# build docker image
docker buildx build -t app:1.0.0-dev19 --platform linux/amd64 . --load

# tag image
docker tag app:1.0.0-dev19 gcr.io/homieverse-api/app:1.0.0-dev19

#auth gcloud
gcloud auth configure-docker

#push image
docker push gcr.io/homieverse-api/app:1.0.0-dev19              