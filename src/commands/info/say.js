const Command = require("../../structures/Command");

module.exports = class SayCommand extends Command {
	constructor(client) {
		super(client, {
			name: "say",
			description: "The bot repeat that you say!",
			options: [
				{
					name: "message",
					description: "What do you want the bot to say?",
					type: 3,
					required: true,
				},
			],
		});
	}

	run = interaction => {
		//console.log(interaction.options.getString("Message"));
		interaction.reply(interaction.options.getString("message"));
	};
};
