import client from '@/Client';
import User from '@/models/User';
import { Events } from 'discord.js';

export default {
	name: Events.VoiceStateUpdate,

	async execute(oldState, newState) {
		const guildId = newState.guild.id;
		const { channelId: newChannelVoiceID, id: userId } = newState;

		if (userId !== client.user.id) {
			let user = await User.findById(client.user.id);

			if (!user) {
				user = new User({
					_id: client.user.id,
					username: client.user.username
				});
			}

			if (newChannelVoiceID === null) {
				user.voiceChannel = null;
			} else {
				user.voiceChannel = {
					guild: guildId,
					voice: newChannelVoiceID
				};
			}

			await user.save();
		}
	}
};
