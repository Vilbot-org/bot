import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import config from '../../../app.config';

export default async (client, interaction, queue) => {
	if (!queue)
		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(':x: Music in not playing!')
			],
			ephemeral: true
		});

	try {
		//Check if the user can moderate
		if (
			interaction.member.permissions.has(
				PermissionsBitField.Flags.ModerateMembers
			)
		) {
			await queue.delete();
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.success)
						.setTitle(':wave: The bot has been disconnected!')
						.setDescription('Bye, bye!')
				]
			});
		}

		return interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(":x: You don't have permission to do that!")
			],
			ephemeral: true
		});
	} catch (e) {
		return interaction.reply(`Something went wrong: ${e}`);
	}
};
