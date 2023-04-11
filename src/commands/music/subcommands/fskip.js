import { EmbedBuilder, PermissionsBitField } from 'discord.js';

import config from '../../../app.config';
import MusicErrors from '../../../errors/MusicErrors';

export default async (interaction, queue) => {
	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers
		)
	)
		throw new MusicErrors(
			"You don't have permission to do that",
			'Only moderators and administrators are allowed to use this command'
		);

	if (!queue)
		throw new MusicErrors(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

	queue.node.skip();

	const embedMessage = new EmbedBuilder().setColor(config.colors.success);
	const { tracks } = queue;
	const title = !queue.isEmpty()
		? `:track_next: ${tracks.at(0).title}`
		: ':wave: Bye bye!';
	// eslint-disable-next-line no-nested-ternary
	const description = !queue.isEmpty()
		? queue.getSize() > 1
			? `The next song is: [${tracks.at(1).title}](${tracks.at(1).url})`
			: 'There are no more songs in the queue!'
		: 'No more songs in the queue';

	embedMessage.setTitle(`${title}`);
	embedMessage.setDescription(`${description}`);

	await interaction.reply({
		embeds: [embedMessage]
	});
};
