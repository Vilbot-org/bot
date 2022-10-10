# Vilbot

## Docker

### Docker image

Build the image

```Shell
docker build -t vilbot .
```

#### Run the image

Run the container in background

```Shell
docker run -d vilbot
```

Run in interaction mode

```Shell
docker run -it vilbot
```

### Docker compose

To start the enviroment

```Shell
docker-compose up -d
```

If any changes are made on the code

```Shell
docker-compose up -d --build
```

To destroy stop and destroy all containers of this enviroment

```Shell
docker-compose down
```
