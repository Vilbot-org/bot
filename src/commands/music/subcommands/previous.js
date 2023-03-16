import { EmbedBuilder } from 'discord.js';
import { useHistory } from 'discord-player';

import config from '../../../app.config';

export default async (interaction) => {
	const history = useHistory(interaction.guild.id);

	await history.previous();

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Going back to the previous song' })
				.setTitle(`:track_previous: ${history.queue.currentTrack.title}`)
				.setURL(`${history.queue.currentTrack.url}`)
				.setDescription(
					history.queue.getSize() > 1
						? `The next song is:  [${history.queue.tracks.at(1).title}](${
								history.queue.tracks.at(1).url
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  })`
						: 'There are no more songs in the queue!'
				)
		]
	});
};
