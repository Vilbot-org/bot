import { randomUUID as uuidv4 } from 'node:crypto';
import pino, { type LoggerOptions, type Logger as PinoLogger } from 'pino';

import type { TargetOptions } from '@/types/serviceTypes';
import env from '@/utils/validEnv';

const targets: TargetOptions[] = [
	{
		target: 'pino/file',
		level: 'info',
		options: {
			destination: './logs/app.log',
			mkdir: true,
			sync: false
		}
	},
	{
		target: 'pino/file',
		level: 'error',
		options: {
			destination: './logs/app-error.log',
			mkdir: true,
			sync: false
		}
	}
];

if (env.APP_ENV === 'development') {
	targets.push({
		target: 'pino-pretty',
		level: 'info',
		options: {
			colorize: true,
			ignore:
				'environment,source,module,action,name,context,executionId,executionTime,shardId,guildId,interactionType'
		}
	});
} else {
	targets.push({
		target: 'pino/file',
		level: 'info',
		options: {
			colorize: true,
			sync: false
		}
	});
}

const logLevelConfig: LoggerOptions = {
	level: 'info',
	timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
	base: {
		environment: env.APP_ENV
	}
};

export default class Logger {
	private logger: PinoLogger;

	constructor(
		module: string,
		name: string,
		executionId?: string,
		guildId?: string
	) {
		const logger = pino(logLevelConfig, pino.transport({ targets })).child({
			module,
			name,
			executionId: executionId ?? uuidv4(),
			guildId
		});

		this.logger = logger;
	}

	public info(message: string): void {
		this.logger.info(message);
	}

	public error(message: string): void {
		this.logger.error(message);
	}

	public warn(message: string): void {
		this.logger.warn(message);
	}

	public trace(message: string): void {
		this.logger.trace(message);
	}
}
