import client from '@/Client';
import User from '@/models/User';
import { Events } from 'discord.js';

export default {
	name: Events.VoiceStateUpdate,

	async execute(oldState, newState) {
		const guildID = newState.guild.id;
		const { channelId: newChannelVoiceID, id: userID } = newState;

		if (userID !== client.user.id) {
			let user = await User.findById(userID);

			if (!user) {
				user = new User({
					_id: userID,
					username: client.users.cache.get(userID).username
				});
			}

			if (newChannelVoiceID === null) {
				user.currentVoiceChannel = null;
			} else {
				user.currentVoiceChannel = {
					guildId: guildID,
					voiceId: newChannelVoiceID
				};
			}

			await user.save();
		}
	}
};
