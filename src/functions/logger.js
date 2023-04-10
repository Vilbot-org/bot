import pino from 'pino';
import { mkdirSync } from 'fs';
import { join } from 'path';

import config from '../app.config';

if (process.env.APP_ENV === 'prod') mkdirSync('./logs');
const pinoDestination =
	process.env.APP_ENV === 'prod'
		? pino.destination(join(process.cwd(), 'logs', 'app.log'))
		: null;

const logger = pino(
	{
		name: config.botName,
		formatters: {
			level: (label) => ({ level: label.toUpperCase() })
		},
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
	},
	pinoDestination
);

export default logger;
