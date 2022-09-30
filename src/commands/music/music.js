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
							name: "track",
							name: "track",
							description: "The name of the track that you want to play!",
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

		require(`./subcommands/${subCommand}`)(this.client, interaction);
	};
};
