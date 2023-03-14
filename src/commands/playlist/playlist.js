import { ApplicationCommandOptionType } from 'discord.js';
import Command from '../../structures/Command';

import errorHandler from '../../handlers/errorHandler';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'playlist',
			description: 'Command to manage your playlists.',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'create',
					description: 'Create a new playlist.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'name',
							description: 'The new of your new platlist.',
							type: ApplicationCommandOptionType.String,
							required: false
						}
					]
				},
				{
					name: 'delete',
					description: 'Delete a specific playlist.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'name',
							description: 'The name of the playlist you want to delete.',
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				},
				{
					name: 'list',
					description: 'List your saved playlists.',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'show',
					description: 'Display the songs in a playlist.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'name',
							description: 'The name of the playlist to show.',
							type: ApplicationCommandOptionType.String,
							required: false
						}
					]
				},
				{
					name: 'add',
					description: 'Add a new song in your playlist.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'song',
							description: 'The name or URL of the song to add.',
							type: ApplicationCommandOptionType.String,
							required: true
						},
						{
							name: 'playlist',
							description: 'The playlist you want to add this song.',
							type: ApplicationCommandOptionType.String,
							required: false
						}
					]
				},
				{
					name: 'remove',
					description: 'Remove a song in your playlist.',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'song',
							description: 'The id of the song in your playlist.',
							type: ApplicationCommandOptionType.String,
							required: true
						},
						{
							type: ApplicationCommandOptionType.String,
							name: 'playlist',
							description: 'The playlist you want to remove this song.',
							required: false
						}
					]
				},
				{
					name: 'help',
					description: 'Display help about this command.',
					type: ApplicationCommandOptionType.Subcommand
				}
			]
		});
	}

	run = async (interaction) => {
		const subCommand = interaction.options.getSubcommand();

		try {
			const { default: subCommandFunction } = await import(
				`./subcommands/${subCommand}`
			);
			await subCommandFunction(this.client, interaction);
		} catch (e) {
			errorHandler(interaction, e);
		}
	};
}
