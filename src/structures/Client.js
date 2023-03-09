import "dotenv/config";

import { Client } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import mongoose from "mongoose";

import player from "./Player";

export default class extends Client {
	constructor(options) {
		super(options);

		this.commands = [];
		this.loadCommands();
		this.loadEvents();

		//Music
		this.player = player(this);
	}

	async loadCommands(path = "./src/commands") {
		const categories = readdirSync(path);
		//Read the categories of the commands (folders inside commands)
		for (const category of categories) {
			const commands = readdirSync(`${path}/${category}`).filter(file => file.endsWith(".js"));
			//Read all the comands in the category (js files)
			for (const command of commands) {
				//Create new commands
				const commandClass = (await import(`${join(process.cwd(), path, category, command)}`)).default;

				const cmd = new commandClass(this);

				this.commands.push(cmd);
				console.log(`Command ${command} of the category ${category} are load! (${cmd.name})`);
			}
		}
	}

	async loadEvents(path = "src/events") {
		const categories = readdirSync(path);
		//Read the categories of the commands (folders inside commands)
		for (const category of categories) {
			const events = readdirSync(`${path}/${category}`);
			//Read all the comands in the category (js files)
			for (const event of events) {
				//Create new commands
				const eventClass = (await import(`${join(process.cwd(), path, category, event)}`)).default;
				const evnt = new eventClass(this);

				this.on(evnt.name, evnt.run);
				console.log(`Command ${event} of the category ${category} are load! (${evnt.name})`);
			}
		}
	}

	registerCommands() {
		if (process.env.APP_ENV == "dev") this.guilds.cache.get(process.env.GUILD_ID).commands.set(this.commands);
		else this.application.commands.set(this.commands);
	}

	async databaseConnection() {
		mongoose.set("strictQuery", true);
		1;
		this.db = await mongoose.connect(process.env.CONNECTION_DB, { dbName: "vilbot" });

		console.log(`Success connection to ${this.db.connection.name} DB`);
	}
}
