require("dotenv").config();

const { Client } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { connect } = require("mongoose");

const player = require("./Player");

module.exports = class extends Client {
	constructor(options) {
		super(options);

		this.commands = [];
		this.loadCommands();
		this.loadEvents();

		//Music
		this.player = player(this);
		//Languages
	}

	loadCommands(path = "./src/commands") {
		const categories = readdirSync(path);
		//Read the categories of the commands (folders inside commands)
		for (const category of categories) {
			const commands = readdirSync(`${path}/${category}`).filter(file => file.endsWith(".js"));
			//Read all the comands in the category (js files)
			for (const command of commands) {
				//Create new commands
				const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`));
				const cmd = new commandClass(this);

				this.commands.push(cmd);
				console.log(`Command ${command} of the category ${category} are load! (${cmd.name})`);
			}
		}
	}

	loadEvents(path = "src/events") {
		const categories = readdirSync(path);
		//Read the categories of the commands (folders inside commands)
		for (const category of categories) {
			const events = readdirSync(`${path}/${category}`);
			//Read all the comands in the category (js files)
			for (const event of events) {
				//Create new commands
				const eventClass = require(join(process.cwd(), `${path}/${category}/${event}`));
				const evnt = new eventClass(this);

				this.on(evnt.name, evnt.run);
				console.log(`Command ${event} of the category ${category} are load! (${evnt.name})`);
			}
		}
	}

	registerCommands() {
		this.guilds.cache.get(process.env.GUILD_ID).commands.set(this.commands);
		//In production mode
		//this.application.commands.set(this.commands)
	}

	async databaseConnection() {
		await connect(process.env.CONNECTION_DB, { dbName: "vilbot" });

		console.log("Success DB connection");

		this.db = { connect };
	}
};
