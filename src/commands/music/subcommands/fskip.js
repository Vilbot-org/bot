import { EmbedBuilder, PermissionsBitField } from 'discord.js';

import config from '../../../app.config';

export default async (interaction, queue) => {
	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers
		)
	)
		throw new Error(
			"You don't have permission to do that",
			'Only moderators and administrators are allowed to use this command'
		);

	if (!queue || queue.getSize() === 0)
		throw new Error(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

	queue.node.skip();

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setAuthor({ name: 'Forcing the skip of the song' })
				.setTitle(`:track_next: ${queue.tracks.at(0).title}`)
				.setURL(`${queue.tracks.at(0).url}`)
				.setDescription(
					queue.getSize() > 1
						? `The next song is:  [${queue.tracks.at(1).title}](${
								queue.tracks.at(1).url
								// eslint-disable-next-line no-mixed-spaces-and-tabs
						  })`
						: 'There are no more songs in the queue!'
				)
		]
	});
};
