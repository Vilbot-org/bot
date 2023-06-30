//Enviroment variables and configs
import 'dotenv/config';

import client from './src/Client';

import socket from './src/sockets/socket';

socket.emit('connection', 'connected');

client.login(process.env.DISCORD_TOKEN);
