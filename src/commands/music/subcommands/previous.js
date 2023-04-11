import { useHistory } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

import config from '../../../app.config';
import MusicErrors from '../../../errors/MusicErrors';

export default async (interaction) => {
	const history = useHistory(interaction.guild.id);

	if (!history)
		throw new MusicErrors(
			"Can't go to previous song",
			'No songs in the previous queue.'
		);

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
