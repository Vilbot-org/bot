import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import pino from 'pino';
import config from '../app.config';

if (process.env.APP_ENV === 'prod' && !existsSync('./logs'))
	mkdirSync('./logs');

const fileStream = pino.destination(join(process.cwd(), 'logs', 'app.log'));
const consoleStream = process.stdout;

const streams = pino.multistream([
	{ stream: fileStream },
	{ stream: consoleStream }
]);

const logger = pino(
	{
		name: config.botName,
		formatters: {
			level: (label) => ({ level: label.toUpperCase() })
		},
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
	},
	streams
);

export default logger;
