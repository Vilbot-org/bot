import mongoose from 'mongoose';

import Logger from '@/common/services/Logger';
import env from './validEnv';

const logger = new Logger('utils', 'databaseConnection');

const databaseConnection = async () => {
	try {
		mongoose.set('strictQuery', true);
		const db = await mongoose.connect(env.DB_URI, {
			dbName: env.DB_NAME
		});

		logger.info(`Success connection to ${db.connection.name} DB`);
	} catch (error) {
		logger.error(`Error connection to DB: ${error}`);
		process.exit(1);
	}
};

export default databaseConnection;
