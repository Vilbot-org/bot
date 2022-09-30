const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "music",
			description: "Command to control the music of the bot.",
			type: 2,
			options: [
				{
					name: "play",
					description: "Play a song in the voice channel!",
					type: 1,
					options: [
						{
							name: "song",
							description: "Enter the name of the song  or the URL.",
							type: 3,
							required: true,
						},
					],
				},
				{
					name: "queue",
					description: "See the queue of the bot!",
					type: 1,
				},
			],
		});
	}

	run = async interaction => {
		const subCommand = interaction.options.getSubcommand();

		require(`./subcommands/${subCommand}`)(this.client, interaction);
	};
};
