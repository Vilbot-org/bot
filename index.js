//Enviroment variables and configs
import 'dotenv/config';

import client from './src/Client';

client.login(process.env.DISCORD_TOKEN);
