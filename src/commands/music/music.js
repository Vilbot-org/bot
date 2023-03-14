import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord.js';
import Command from '../../structures/Command';

import errorHandler from '../../handlers/errorHandler';

export default class extends Command {
	constructor(client) {
		super(client, {
			name: 'music',
			description: 'Command to control the music of the bot.',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'play',
					description: 'Play a song in the voice channel!',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'song',
							description: 'Enter the name of the song  or the URL.',
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				},
				{
					name: 'playlist',
					description: 'Play a playlist in the voice channel!',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'playlist',
							description: 'Enter the name of your playlist.',
							type: ApplicationCommandOptionType.String,
							required: false
						}
					]
				},
				{
					name: 'queue',
					description: 'See the queue of the bot!',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'skip',
					description: 'Skip the current song!',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'fskip',
					description: 'Force the skip (no votation).',
					type: ApplicationCommandOptionType.Subcommand,
					default_member_permissions: PermissionFlagsBits.ManageGuild
				},
				{
					name: 'pause',
					description: 'Pause the music!',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'resume',
					description: 'Resume the music!',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'quit',
					description: 'Disconnect the bot of music!',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'setup',
					description: 'Run this command to setup the bot!',
					type: ApplicationCommandOptionType.Subcommand,
					default_member_permissions: PermissionFlagsBits.ManageGuild
				},
				{
					name: 'info',
					description: 'Info about the current song!',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: 'help',
					description: 'See the main commands and aditional info!',
					type: ApplicationCommandOptionType.Subcommand
				}
			]
		});
	}

	run = async (interaction) => {
		const subCommand = interaction.options.getSubcommand();

		try {
			if (
				!interaction.member.voice.channel &&
				subCommand !== 'setup' &&
				subCommand !== 'clear' &&
				subCommand !== 'help'
			)
				throw new Error('in-voice-channel');

			const queue = await this.client.player.nodes.get(interaction.guildId);

			const { default: subCommandFunction } = await import(
				`./subcommands/${subCommand}`
			);
			await subCommandFunction(this.client, interaction, queue);
		} catch (e) {
			errorHandler(interaction, e);
		}
	};
}
