import { ChatInputCommandInteraction } from 'discord.js';

import Command from '@/classes/Command';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const subCommand = interaction.options.getSubcommand();

	const { default: subCommandFunction } = await import(
		`./subcommands/${subCommand}`
	);
	await subCommandFunction(interaction);
};

const playlistCommandOptions = {
	name: 'playlist',
	description: 'Command to manage your playlists.',
	execute: execute,
	subcommands: [
		{
			name: 'create',
			description: 'Create a new playlist.',
			option: {
				name: 'name',
				description: 'The new of your new playlist.'
			}
		},
		{
			name: 'delete',
			description: 'Delete a specific playlist.',
			option: {
				name: 'name',
				description: 'The name of the playlist you want to delete.',
				required: true
			}
		},
		{
			name: 'list',
			description: 'List your saved playlists.'
		},
		{
			name: 'show',
			description: 'Display the songs in a playlist.',
			option: {
				name: 'name',
				description: 'The name of the playlist to show.'
			}
		},
		{
			name: 'add',
			description: 'Add a new song in your playlist.',
			option: {
				name: 'song',
				description: 'The name or URL of the song to add.',
				required: true
			}
		},
		{
			name: 'remove',
			description: 'Remove a song in your playlist.',
			option: {
				name: 'song',
				description: 'The id of the song in your playlist.',
				required: true
			}
		}
	]
};
const playlistCommand = new Command(playlistCommandOptions);

export default playlistCommand;
