import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import pino from 'pino';
import env from './validEnv';

if (!existsSync('./logs')) {
	mkdirSync('./logs');
}

const fileStream = pino.destination(join(process.cwd(), 'logs', 'app.log'));
const consoleStream = process.stdout;

const streams = pino.multistream([
	{ stream: fileStream },
	{ stream: consoleStream }
]);

const logger = pino(
	{
		name: env.APP_NAME,
		formatters: {
			level: (label) => ({ level: label.toUpperCase() })
		},
		timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
	},
	streams
);

export default logger;
