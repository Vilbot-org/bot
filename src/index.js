// Enviroment variables and configs
import 'dotenv/config';

import client from './Client';

client.login(process.env.DISCORD_TOKEN);
