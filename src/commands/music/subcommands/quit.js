import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import config from '../../../app.config';

export default async (interaction, queue) => {
	if (
		!interaction.member.permissions.has(
			PermissionsBitField.Flags.ModerateMembers
		)
	)
		throw new Error(
			'No permissions',
			'You dont have permissions to exec this command.'
		);

	if (!queue)
		throw new Error(
			'Music queue',
			'No songs in the queue, use `/music play <song>` do add songs.'
		);

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
