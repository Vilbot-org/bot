import mongoose from 'mongoose';
import logger from './logger';

export default async () => {
	mongoose.set('strictQuery', true);
	const db = await mongoose.connect(process.env.DB_URI, {
		dbName: process.env.DB_NAME
	});

	logger.info(`Success connection to ${db.connection.name} DB`);
};
