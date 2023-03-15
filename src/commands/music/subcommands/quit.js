import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import config from '../../../app.config';

export default async (interaction, queue) => {
	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers
		)
	)
		throw new Error('no-permission');

	if (!queue) throw new Error('no-songs-queue');

	await queue.delete();

	await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.success)
				.setTitle(':wave: The bot has been disconnected!')
				.setDescription('Bye, bye!')
		]
	});
};
