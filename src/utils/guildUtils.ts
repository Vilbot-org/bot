import type {
	ChatInputCommandInteraction,
	Client,
	Guild,
	VoiceBasedChannel
} from 'discord.js';
import { VoiceChannel } from 'discord.js';

import MusicError from '@/errors/MusicError';
import type { IBotGuild } from '@/types/IBot';

export const getVoiceChannel = (
	interaction: ChatInputCommandInteraction
): VoiceBasedChannel => {
	const guildMember = interaction.guild!.members.cache.get(interaction.user.id);

	if (!guildMember || !guildMember.voice.channel) {
		throw new MusicError(
			'You are not on any voice channel',
			'You must on voice channel to play music.'
		);
	}

	return guildMember.voice.channel;
};

export const getVoiceChannelById = async (
	client: Client,
	channelId: string
): Promise<VoiceChannel> => {
	const channel = await client.channels.fetch(channelId);

	if (!channel || !(channel instanceof VoiceChannel)) {
		throw new MusicError(
			'You are not on any voice channel',
			'You must on voice channel to play music.'
		);
	}

	return channel;
};

export const getMember = async (interaction: ChatInputCommandInteraction) =>
	await interaction.guild!.members.fetch({
		user: interaction.user!.id
	});

export const findDifferents = (
	arr1: IBotGuild[],
	arr2: Guild[]
): { _id: string; name: string }[] => {
	const map1 = new Map(arr1.map((obj) => [obj._id, obj]));

	const diffObjects = arr2
		.filter((obj) => !map1.has(obj.id))
		.map((obj) => ({ _id: obj.id, name: obj.name }));

	return diffObjects;
};
