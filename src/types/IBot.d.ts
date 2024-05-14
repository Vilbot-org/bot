import type { Track } from 'discord-player';
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	PermissionResolvable,
	User
} from 'discord.js';

export interface ICurrentVoiceChannel {
	guildId: string;
	voiceId: string;
}

export interface IUser extends Document {
	_id: string;
	username: string;
	currentVoiceChannel: ICurrentVoiceChannel;
}

export interface IBotGuild extends Document {
	_id: string;
	name: string;
}

export interface IBotTrack {
	id: string;
	title: string;
	author: string;
	thumbnail: string;
	duration: string;
	durationMS: number;
	requestedBy: User | null;
}

export interface ICurrentTrack extends IBotTrack {
	playbackTime: number;
}

export interface IBotQueue {
	isPaused: boolean;
	currentTrack: ICurrentTrack;
	tracks: Track[];
}

export interface ISubCommandObject {
	name: string;
	description: string;
	option?: {
		name: string;
		description: string;
		required?: boolean;
	};
}

export interface ICommandOptions {
	name: string;
	description: string;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
	permissions?: PermissionResolvable[];
	subcommands?: ISubCommandObject[];
}

export interface ICurrentVoiceChannel {
	guildId: string;
	voiceId: string;
}

export interface IBotUser extends Document {
	_id: string;
	username: string;
	currentVoiceChannel: ICurrentVoiceChannel | null;
}
