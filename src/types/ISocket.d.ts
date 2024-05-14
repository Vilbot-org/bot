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

export interface IBotToServerEvents {
	'bot.requestedQueue': (queue: IBotQueue | null, guildID: string) => void;
	'bot.playedTrack': (track: IBotTrack, guildID: string) => void;
	'bot.skipedTrack': (guildID: string) => void;
	'bot.removedTrack': (trackIndex: number, guild: string) => void;
	'bot.resumedMusicPlayer': (guildID: string) => void;
	'bot.pausedMusicPlayer': (guildID: string) => void;
	'bot.deletedQueue': (guild: string) => void;
	'bot.startedPlaying': (queue: IBotQueue | null, guildID: string) => void;
	'bot.emptyQueue': (guildID: string) => void;
	'bot.connectionDestroyed': (guildID: string) => void;
	'bot.error': (error: object) => void;
}
