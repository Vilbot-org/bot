import { Guild, VoiceState } from 'discord.js';

import bot from '@/index';
import GuildModel from '@/models/Guild';
import User from '@/models/User';
import Logger from '@/common/services/Logger';

export const voiceStateUpdateEvent = async (
	_oldState: VoiceState,
	newState: VoiceState
) => {
	const guildID = newState.guild.id;
	const { channelId: newChannelVoiceID, id: userID } = newState;

	if (userID !== bot.user?.id) {
		const username = bot.users.cache.get(userID)?.username;

		const update =
			newChannelVoiceID === null
				? { username, currentVoiceChannel: null }
				: {
						username,
						currentVoiceChannel: {
							guildId: guildID,
							voiceId: newChannelVoiceID
						}
				  };

		await User.findOneAndUpdate({ _id: userID }, update, { upsert: true });
	}
};

export const guildCreateEvent = async (guild: Guild) => {
	const newGuild = new GuildModel({
		_id: guild.id,
		name: guild.name
	});

	await newGuild.save();

	Logger.info(
		'events',
		'guildCreateEvent',
		`The "${newGuild.name}" guild was added.`,
		guild.id
	);
};

export const guildDeleteEvent = async (guild: Guild) => {
	const deletedGuild = await GuildModel.findByIdAndDelete(guild.id);

	if (deletedGuild) {
		Logger.info(
			'events',
			'guildDeleteEvent',
			`The "${deletedGuild.name}" guild was removed.`,
			guild.id
		);
	}
};
