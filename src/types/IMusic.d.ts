import type { GuildQueue } from 'discord-player';
import type { VoiceChannel } from 'discord.js';

export interface GuildMusicQueueAndVoiceInfo extends GuildQueue {
	metadata: {
		channel: VoiceChannel;
	};
}
