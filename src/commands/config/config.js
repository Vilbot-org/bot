const { SlashCommandBuilder } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			description: "Commands to config the bot to your Discord server.",
			type: 2,
			options: [
				{
					name: "language",
					description: "Set the language of the bot!",
					type: 1,
					options: [
						{
							name: "language",
							description: "The language to set.",
							type: 3,
							required: true,
							choices: [
								{ name: "es", value: "es" },
								{ name: "en", value: "en" },
							],
						},
					],
				},
			],
		});
	}

	run = interaction => {
		const subCommand = interaction.options.getSubcommand();

		require(`./submcommands/${subCommand}`)(this.client, interaction);
	};
};
