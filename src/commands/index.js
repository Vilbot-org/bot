import ping from "./info/ping.js";
import help from "./info/help.js";

import * as path from "path";
import * as fs from "fs/promises";

export default [ping, help];
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
