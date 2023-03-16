import pino from 'pino';
import { mkdirSync } from 'fs';
import { join } from 'path';

import config from '../app.config';

/* const fileTransport =
	process.env.APP_ENV !== 'dev'
		? pino.transport({
				target: 'pino/file',
				options: { destination: join(process.cwd(), 'logs', 'app.log') }
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  })
		: null; */

if (process.env.APP_ENV === 'prod') mkdirSync('./logs');
const pinoDestination =
	process.env.APP_ENV === 'prod'
		? pino.destination(join(process.cwd(), 'logs', 'app.log'))
		: null;

/* 
	logger =
} else {
	logger = pino({
		formatters: {
			level: (label) => ({ level: label.toUpperCase() })
		},
		timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`
	});
} */

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
