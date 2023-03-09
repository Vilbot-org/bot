import "dotenv/config";

import { Client } from "discord.js";
import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";

import player from "./Player.js";

import commands from "../commands/index.js";
import events from "../events/index.js";

export default class extends Client {
	constructor(options) {
		super(options);

		this.commands = [];
		this.loadCommands();
		this.loadEvents();

		//Music
		this.player = player(this);
	}

	async loadCommands() {
		/* 	const categories = await readdir(path);

		for (const category of categories) {
			const commands = await readdir(`${path}/${category}`);

			for (const command of commands.filter(file => file.endsWith(".js"))) {
				const CommandClass = await import(`${path}/${category}/${command}`);
				const cmd = new CommandClass(this);

				this.commands.push(cmd);
				console.log(`Command ${command} of the category ${category} are load! (${cmd.name})`);
			}
		} */

		/* const importDirectory = async directoryPath => {
			const files = await fs.readdir(directoryPath);
			const modules = [];

			for (const file of files) {
				if (file.endsWith(".js")) {
					const filePath = path.join(directoryPath, file);
					const importedModule = await import(filePath);
					modules.push(importedModule);
				}
			}

			return modules;
		};

		const modules = await importDirectory("./src/commands/info");

		console.log(modules); */

		this.commands = commands.map(command => {
			const cmd = new command(this);
			console.log(`Command are load! (${cmd.name})`);

			return cmd;
		});
	}

	async loadEvents() {
		/* const categories = readdirSync(path);
		//Read the categories of the commands (folders inside commands)
		for (const category of categories) {
			const events = readdirSync(`${path}/${category}`);
			//Read all the comands in the category (js files)
			for (const event of events) {
				//Create new commands
				const eventClass = await import(`${join(process.cwd(), `${path}/${category}/${event}`)}`);
				const evnt = new eventClass(this);

				this.on(evnt.name, evnt.run);
				console.log(`Command ${event} of the category ${category} are load! (${evnt.name})`);
			}
		} */

		events.map(event => {
			const evnt = new event(this);

			this.on(evnt.name, evnt.run);
			console.log(`Event are load! (${evnt.name})`);
		});
	}

	registerCommands() {
		if (process.env.APP_ENV == "dev") this.guilds.cache.get(process.env.GUILD_ID).commands.set(this.commands);
		else this.application.commands.set(this.commands);
	}

	async databaseConnection() {
		mongoose.set("strictQuery", true);
		this.db = await mongoose.connect(process.env.CONNECTION_DB, { dbName: "vilbot" });

		console.log(`Success connection to ${this.db.connection.name} DB`);
	}
}
