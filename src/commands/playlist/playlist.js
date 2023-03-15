import { SlashCommandBuilder } from 'discord.js';

import errorHandler from '../../handlers/errorHandler';

export default {
	data: new SlashCommandBuilder()
		.setName('playlist')
		.setDescription('Command to manage your playlists.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription('Create a new playlist.')
				.addStringOption((option) =>
					option.setName('name').setDescription('The new of your new playlist.')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('delete')
				.setDescription('Delete a specific playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('The name of the playlist you want to delete.')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('list').setDescription('List your saved playlists.')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('show')
				.setDescription('Display the songs in a playlist.')
				.addStringOption((option) =>
					option
						.setName('name')
						.setDescription('The name of the playlist to show.')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add a new song in your playlist.')
				.addStringOption((option) =>
					option
						.setName('song')
						.setDescription('The name or URL of the song to add.')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('playlist')
						.setDescription('The playlist you want to add this song.')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove a song in your playlist.')
				.addStringOption((option) =>
					option
						.setName('song')
						.setDescription('The id of the song in your playlist.')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('playlist')
						.setDescription('The playlist you want to remove this song.')
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('help')
				.setDescription('Display help about this command.')
		),

	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();

		try {
			const { default: subCommandFunction } = await import(
				`./subcommands/${subCommand}`
			);
			await subCommandFunction(interaction);
		} catch (e) {
			errorHandler(interaction, e);
		}
	}
};
