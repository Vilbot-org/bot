const { Client } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = class extends Client {
	constructor(options) {
		super(options);

		this.commands = [];
		this.loadCommands();
		this.loadEvents();
	}

	/* 	loadCommands(path = "./src/commands") {
		const categories = readdirSync(path);
		//Read the categories of the commands (folders inside commands)
		for (const category of categories) {
			const commands = readdirSync(`${path}/${category}`);
			//Read all the comands in the category (js files)
			for (const command of commands) {
				//Create new commands
				const commandClass = require(join(process.cwd(), `${path}/${category}/${command}`));
				const cmd = new commandClass(this);

				this.commands.push(cmd);
				console.log(`Command ${command} of the category ${category} are load! (${cmd.name})`);
			}
		}
	} */

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
		this.guilds.cache.get("710627596769165333").commands.set(this.commands);
		//In production mode
		//this.application.commands.set(this.commands)
	}

	loadCommands(path = "./src/commands") {
		//Create new commands
		const PingCommand = require("../commands/info/ping");
		const cmd = new PingCommand(this);

		this.commands.push(cmd);
		console.log(`Command ${cmd.name} are load! `);
	}
};
