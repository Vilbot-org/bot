import { GuildQueue } from 'discord-player';
import { useMainPlayer as player, useHistory, useQueue } from 'discord-player';
import { VoiceBasedChannel } from 'discord.js';

import bot from '@/index';
import MusicError from '@/errors/MusicError';
import { SocketEvents } from '@/enums/Sockets';

export const getQueue = (voiceChannel: VoiceBasedChannel): GuildQueue => {
	const queue = useQueue(voiceChannel);

	if (!queue) {
		throw new MusicError(
			'Music queue',
			'No songs in the queue, use `/music play <song>` to add songs.'
		);
	}

	return queue;
};

export const searchTrack = async (query: string) => {
	const searchResult = await player().search(query);

	if (!searchResult.hasTracks()) {
		throw new MusicError(
			'No results found',
			'No results were found for that request, try another name or a YouTube URL.'
		);
	}

	return searchResult;
};

export const play = async (
	query: string,
	voiceChannel: VoiceBasedChannel,
	userId: string
) => {
	const searchResult = await searchTrack(query);

	const user = bot.users.cache.get(userId);
	if (user) {
		searchResult.setRequestedBy(user);
	}

	const { queue, track } = await player().play(voiceChannel, searchResult, {
		nodeOptions: {
			volume: 40,
			leaveOnEndCooldown: 300000,
			metadata: { channel: voiceChannel }
		}
	});

	return { queue, track };
};

export const previous = async (voiceChannel: VoiceBasedChannel) => {
	const history = useHistory(voiceChannel);
	if (!history || !history.previousTrack) {
		throw new MusicError(
			'Cant go to previous song',
			'No songs in the previous queue.'
		);
	}
	await history.previous();

	return history.queue;
};

export const skip = (voiceChannel: VoiceBasedChannel) => {
	const queue = getQueue(voiceChannel);
	queue.node.skip();

	return queue;
};

export const pause = (voiceChannel: VoiceBasedChannel) => {
	const queue = getQueue(voiceChannel);
	const isPaused = queue.node.setPaused(true);

	if (!isPaused) {
		throw new MusicError(
			'The music is already paused',
			'Use `/music resume` to resume a song.'
		);
	}

	return true;
};

export const resume = (voiceChannel: VoiceBasedChannel) => {
	const queue = getQueue(voiceChannel);
	const isPaused = queue.node.setPaused(false);

	if (!isPaused) {
		throw new MusicError(
			'The music is not paused',
			'Use `/music pause` to pause a song.'
		);
	}

	return true;
};

export const quit = (voiceChannel: VoiceBasedChannel) => {
	const queue = getQueue(voiceChannel);
	queue.delete();

	return true;
};

export const removeTrack = (
	trackIndex: number,
	voiceChannel: VoiceBasedChannel
) => {
	const queue = getQueue(voiceChannel);
	queue.removeTrack(trackIndex);

	bot.socket.emit(SocketEvents.BotRemovedTrack, {
		trackIndex,
		guildId: queue.guild.id
	});

	return true;
};

export const playPlaylist = async (
	tracks: string[],
	voiceChannel: VoiceBasedChannel,
	userId: string
) => {
	if (tracks.length >= 1) {
		for (const track of tracks) {
			await play(track, voiceChannel, userId);
		}
	}

	return true;
};
