import { EmbedBuilder } from 'discord.js';

import DeferError from '../errors/DeferErrors';

import config from '../app.config';

const errorConfig = {
	'in-voice-channel': {
		title: 'You need to be in a voice channel!',
		description: 'Enter to any voice channel and try again.'
	},

	'no-permission': {
		title: "You don't have permission to do that!",
		description:
			'Only moderators and administrators are allowed to use this command.'
	},

	'no-songs-queue': {
		title: 'Music queue!',
		description: 'No songs in the queue, use `/music play <song>` do add songs!'
	},

	'music-already-paused': {
		title: 'The music is already paused!',
		description: 'Use `/music resume` to resume a song.'
	},

	'music-resumed': {
		title: 'The music in not paused!',
		description: 'Use `/music pause` to pause a song.'
	},

	'playlist-dont-exist': {
		title: "This playlist don't exist!",
		description: 'Use `/playlist create <playlist>` to create a playlist.'
	},

	'playlist-no-songs': {
		title: "This playlist don't have songs!",
		description:
			'You can add songs to this playlist with the following command: `/playlist add <song> <playlist>`.'
	},

	'channel-already-exist': {
		title: 'The channel already exists!',
		description: `If you want to reset the bot channel please delete the '${config.botName}-music' text channel and run this command again.`
	},

	'creating-channel': {
		title: 'An error occurred while creating the channel!',
		description: `Check the permissions and try again.`
	},

	'already-vote': {
		title: 'You have already voted!',
		description: `Wait for the vote to be resolved.`
	},

	default: {
		title: 'Oops! Unexpected error',
		description: 'Wait a few seconds and try again.'
	}
};

export default async (interaction, error) => {
	const { title, description } =
		errorConfig[error.message] || errorConfig.default;

	if (error instanceof DeferError) {
		await interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(`:x: ${title}`)
					.setDescription(description)
			],
			ephemeral: true
		});
	} else {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(`:x: ${title}`)
					.setDescription(description)
			],
			ephemeral: true
		});
	}
};
