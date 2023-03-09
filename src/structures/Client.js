import 'dotenv/config';

import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import mongoose from 'mongoose';

import player from './Player';

export default class extends Client {
	constructor(options) {
		super(options);

		this.commands = [];
		this.loadCommands();
		this.loadEvents();

		//Music
		this.player = player(this);
	}

	loadCommands(path = './src/commands') {
		const categories = readdirSync(path);

		categories.map(async (category) => {
			const commands = readdirSync(`${path}/${category}`).filter((file) =>
				file.endsWith('.js')
			);

			await Promise.all(
				commands.map(async (command) => {
					const CommandClass = (
						await import(`${join(process.cwd(), path, category, command)}`)
					).default;

					const cmd = new CommandClass(this);

					this.commands.push(cmd);
					console.log(
						`Command ${command} of the category ${category} are load! (${cmd.name})`
					);
				})
			);
		});
	}

	async loadEvents(path = 'src/events') {
		const categories = readdirSync(path);

		categories.map(async (category) => {
			const events = readdirSync(`${path}/${category}`);

			await Promise.all(
				events.map(async (event) => {
					const EventClass = (
						await import(`${join(process.cwd(), path, category, event)}`)
					).default;
					const evnt = new EventClass(this);

					this.on(evnt.name, evnt.run);
					console.log(
						`Event ${event} of the category ${category} are load! (${evnt.name})`
					);
				})
			);
		});
	}

	registerCommands() {
		if (process.env.APP_ENV === 'dev')
			this.guilds.cache.get(process.env.GUILD_ID).commands.set(this.commands);
		else this.application.commands.set(this.commands);
	}

	async databaseConnection() {
		mongoose.set('strictQuery', true);
		this.db = await mongoose.connect(process.env.CONNECTION_DB, {
			dbName: 'vilbot'
		});

		console.log(`Success connection to ${this.db.connection.name} DB`);
	}
}
