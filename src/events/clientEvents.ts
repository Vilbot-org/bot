import { Guild, VoiceState } from 'discord.js';

import bot from '@/index';
import GuildModel from '@/models/Guild';
import User from '@/models/User';
import logger from '@/utils/logger';

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

		console.log(update);
		console.log(await User.find());
		await User.findOneAndUpdate({ _id: userID }, update, { upsert: true });
		console.log({
			_id: userID
		});
	}
};

export const guildCreateEvent = async (guild: Guild) => {
	const newGuild = new GuildModel({
		_id: guild.id,
		name: guild.name
	});

	await newGuild.save();

	logger.info(`The "${newGuild.name}" guild was added.`);
};

export const guildDeleteEvent = async (guild: Guild) => {
	const deletedGuild = await GuildModel.findByIdAndDelete(guild.id);

	if (deletedGuild) {
		logger.info(`The "${deletedGuild.name}" guild was removed.`);
	}
};
