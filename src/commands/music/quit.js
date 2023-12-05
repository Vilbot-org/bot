import config from '@/app.config';
import MusicErrors from '@/errors/MusicErrors';
import { quit } from '@/functions/musicUtils';
import {
	EmbedBuilder,
	PermissionsBitField,
	SlashCommandBuilder
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('quit')
		.setDescription('Disconnect the bot of music!'),

	async execute(interaction) {
		const { guild } = interaction;

		if (
			!interaction.member.permissions.has(
				PermissionsBitField.Flags.ModerateMembers
			)
		) {
			throw new MusicErrors(
				'No permissions',
				'You dont have permissions to exec this command.'
			);
		}

		await quit(guild.id);

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setTitle(':wave: The bot has been disconnected!')
					.setDescription('Bye, bye!')
			]
		});
	}
};
