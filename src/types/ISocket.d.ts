import type { User } from 'discord.js';
import type { IBotQueue, IBotTrack, ICurrentVoiceChannel } from './IBot';

export interface IServerToBotEvents {
	'server.requestQueue': (guildID: string) => void;
	'server.requestPlayTrack': (
		trackURL: string,
		voiceChannelID: string,
		user: User
	) => void;
	'server.requestPreviousTrack': (voiceChannelID: string) => void;
	'server.requestSkipTrack': (voiceChannelID: string) => void;
	'server.requestRemoveTrack': (trackIndex: number, guildID: string) => void;
	'server.requestPlayPlaylist': (
		tracks: string[],
		currentVoiceChannel: ICurrentVoiceChannel,
		user: User
	) => void;
	'server.requestResumeMusicPlayer': (guildID: string) => void;
	'server.requestPauseMusicPlayer': (guildID: string) => void;
}

interface BotQueuePayload {
	queue: IBotQueue | null;
	guildId: string;
}

interface BotTrackPayload {
	track: IBotTrack | null;
	guildId: string;
}

interface BotGuildPayload {
	guildId: string;
}

interface BotTrackIndexPayload {
	trackIndex: number;
	guildId: string;
}

export interface IBotToServerEvents {
	'bot.requestedQueue': (payload: BotQueuePayload) => void;
	'bot.playedTrack': (payload: BotTrackPayload) => void;
	'bot.skipedTrack': (payload: BotGuildPayload) => void;
	'bot.removedTrack': (payload: BotTrackIndexPayload) => void;
	'bot.resumedMusicPlayer': (payload: BotGuildPayload) => void;
	'bot.pausedMusicPlayer': (payload: BotGuildPayload) => void;
	'bot.deletedQueue': (payload: BotGuildPayload) => void;
	'bot.startedPlaying': (payload: BotQueuePayload) => void;
	'bot.emptyQueue': (payload: BotGuildPayload) => void;
	'bot.connectionDestroyed': (payload: BotGuildPayload) => void;
	'bot.error': (error: object) => void;
}
