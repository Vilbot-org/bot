import mongoose from 'mongoose';
import logger from './logger';

export default async () => {
	mongoose.set('strictQuery', true);
	const db = await mongoose.connect(process.env.CONNECTION_DB, {
		dbName: 'vilbot'
	});

	logger.info(`Success connection to ${db.connection.name} DB`);
};
