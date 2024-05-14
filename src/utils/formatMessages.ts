import type { GuildQueue, Track } from 'discord-player';

import type { IBotQueue, IBotTrack } from '@/types/IBot';
import type { GuildMusicQueueAndVoiceInfo } from '@/types/IMusic';

export const formatTrack = (track: Track): IBotTrack => ({
	id: track.id,
	title: track.title,
	author: track.author,
	thumbnail: track.thumbnail,
	duration: track.duration,
	durationMS: track.durationMS,
	requestedBy: track.requestedBy
});

export const formatQueue = (
	fetchedQueue: GuildQueue | GuildMusicQueueAndVoiceInfo
): IBotQueue | null => {
	const { node, currentTrack, tracks } = fetchedQueue;
	const isPaused = node.isPaused();

	if (!currentTrack) {
		return null;
	}

	return {
		isPaused,
		currentTrack: {
			id: currentTrack.id,
			title: currentTrack.title,
			author: currentTrack.author,
			thumbnail: currentTrack.thumbnail,
			duration: currentTrack.duration,
			durationMS: currentTrack.durationMS,
			requestedBy: currentTrack.requestedBy,
			playbackTime: node.playbackTime
		},
		tracks: tracks?.toArray()
	};
};
