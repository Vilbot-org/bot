import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@/app.config';
import { skip } from '@/functions/musicUtils';

export default {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song!'),

	async execute(interaction) {
		const queue = await skip(interaction.guildId);
		const { tracks } = queue;

		const title = queue.isEmpty()
			? ':wave: Bye bye!'
			: `:track_next: ${tracks.at(0).title}`;

		const description =
			!queue.isEmpty() && queue.getSize() > 1
				? `The next song is: [${tracks.at(1).title}](${tracks.at(1).url})`
				: 'No more songs in the queue';

		const embedMessage = new EmbedBuilder()
			.setColor(config.colors.success)
			.setTitle(`${title}`)
			.setDescription(`${description}`);

		if (!queue.isEmpty()) {
			embedMessage
				.setAuthor({ name: 'Forcing the skip of the song' })
				.setThumbnail(`${tracks.at(0).thumbnail}`);
		}

		await interaction.reply({
			embeds: [embedMessage]
		});
	}
};
