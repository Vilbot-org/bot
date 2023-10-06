import { EmbedBuilder } from 'discord.js';

import config from '../app.config';

export default async (interaction) => {
	const interactionReply = await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.danger)
				.setTitle(':x: You cant send that message on this channel!')
				.setDescription(
					'This channel is exclusive for music commands, use another channel to send messages!'
				)
		]
	});
	await interaction.delete();

	setTimeout(() => {
		interactionReply.delete();
	}, 6000);
};
