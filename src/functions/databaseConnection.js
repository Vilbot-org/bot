import mongoose from 'mongoose';

export default async () => {
	mongoose.set('strictQuery', true);
	const db = await mongoose.connect(process.env.CONNECTION_DB, {
		dbName: 'vilbot'
	});

	console.log(`Success connection to ${db.connection.name} DB`);
};
