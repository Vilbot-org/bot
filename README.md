<div align="center">
  <img src="https://user-images.githubusercontent.com/35277540/202900919-37b3a360-7fc2-4fce-a08b-f23e4b0f748d.png" align="center">
<br>

<a href="https://discord.com/oauth2/authorize?client_id=1024599953387044904&permissions=8&scope=bot">
  <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Support">
</a>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JS">
<img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="docker">
<a href="https://ko-fi.com/GFrancV">
	<img src="https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white" alt="ko-fi">
</a>
</div>

<p align="center">
  <a href="#overview">Overview</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="https://vilbot-org.github.io">Documentation</a>
  •
  <a href="#author">Author</a>
  •
  <a href="#license">License</a>
</p>

# Overview

Vilbot is a awesome Discord Bot created by a passionate programmer using the [discord.js](https://discord.js.org) library with varoious functionalities.

This bot and the code is free for everyone and you can invite the bot to your Discord Server with the following [link](https://discord.com/oauth2/authorize?client_id=1024599953387044904&permissions=8&scope=bot) or you can use the font code of the Vilbot to create your own custom Discord bot.

> It is important to read the [license](#license) part in case you want to use the code from this repository.

If you like this project and would like to show your support to the project can you give can you give us a [Ko-fi](https://ko-fi.com/GFrancV).

<div align="center">
	<a href="https://discord.com/oauth2/authorize?client_id=1024599953387044904&permissions=8&scope=bot">
			<img src="https://user-images.githubusercontent.com/35277540/202934244-7297631c-8429-4fe2-8158-a1f64c2bb9cb.png" alt="join-btn" width="250">
	</a>
</div>

## Functionalities

- Music Bot

# Installation

Vilbot is a bot that can be hosted on your own server or on platforms like [Vercel](https://vercel.com/) or [Railway](https://railway.app/), these last services have their own steps to deploy projects and you can see them in their respective documentation.

For deploy Vilbot in your own server you have two options: Docker and Node.js

**Important:** Regardless of the way you want to install Vilbot it is necessary to fill the variables of the `.env` file.

## Node.js

Install all the dependencies

```Shell
npm install
```

You can also install only the production libraries with the following command

```Shell
npm install --omit=dev
```

Once the dependencies are installed, it is only necessary to run the index.js file

```Shell
node index.js
```

> For this installation mode you need to have a MongoDB account in the official site to connect the bot to the DB our have your own server with MongoDB

## Docker

### Docker image

With Docker it is only necessary to build and run the docker image provided in the repository.

```Shell
docker build -t vilbot .
```

```Shell
docker run -d vilbot
```

> For this installation mode you need to have a MongoDB account in the official site to connect the bot to the DB our have your own server with MongoDB

### Docker compose

To have all your complete environment necessary for Vilbot to work correctly, this repository also has a [docker-compose](docker-compose.yml) file.

This file in addition to creating a container for the bot, it will also create a database with MongoDB and a dashboard to manage Mongo with Mongo_express

To start the enviroment use the following command

```Shell
docker-compose up -d
```

If any changes are made on the code run (only for development)

```Shell
docker-compose up -d --build
```

To destroy stop and destroy all containers of this enviroment

```Shell
docker-compose down
```

# Author

- [GFrancV](https://github.com/GFrancV)

# License

This project is under the MIT License.

You can invite the Vilbot to join your server or you can use the Vilbot code to create a new awesome bot.

> Important: You will have to give the necessary credits to this repository in case of creating a new bot using Vilbot as a base.

Please see the [LICENSE](./LICENCE) file
