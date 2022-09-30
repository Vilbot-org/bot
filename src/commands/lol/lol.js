const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "lol",
			description: "Execute lol commands!",
			options: [
				{
					name: "stats",
					description: "See a stats of a specific summoner!",
					type: 1,
					options: [
						{
							name: "summoner",
							description: "Insert the summoner name!",
							type: 3,
							required: true,
						},
					],
				},
			],
		});
	}

	run = async interaction => {
		const subCommand = interaction.options.getSubcommand();

		await require(`./subcommands/${subCommand}`)(this.client, interaction);
	};
};
