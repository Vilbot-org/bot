import { EmbedBuilder, PermissionsBitField } from 'discord.js';

import config from '@/app.config';
import MusicErrors from '@/errors/MusicErrors';
import { fskip } from '@/functions/musicUtils';

export default async (interaction) => {
	const { guild } = interaction;

	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers
		)
	) {
		throw new MusicErrors(
			'You dont have permission to do that',
			'Only moderators and administrators are allowed to use this command'
		);
	}

	const queue = await fskip(guild.id);
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
};
