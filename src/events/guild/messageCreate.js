import Event from '../../structures/Event';

import config from '../../app.config';

export default class extends Event {
	constructor(client) {
		super(client, { name: 'messageCreate' });
	}

	run = async (interaction) => {
		//If the user send a message in the music boy channel and this message is not a command
		if (
			interaction.channel.name ===
				`「🎵」${
					config.botName.charAt(0).toLowerCase() + config.botName.slice(1)
				}-music` &&
			interaction.member.user.id !== this.client.user.id
		) {
			const { default: exclusiveChannelFunction } = await import(
				'../../functions/exclusiveChannel'
			);
			await exclusiveChannelFunction(this.client, interaction);
		}
	};
}
