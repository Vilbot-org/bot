import client from '@/Client';
import Guild from '@/models/Guild';
import { Events } from 'discord.js';

export default {
	name: Events.VoiceStateUpdate,

	async execute(oldState, newState) {
		const guildId = newState.guild.id;
		const { channelId: oldChannelID } = oldState;
		const { channelId: newChannelID, id: userId } = newState;

		if (userId !== client.user.id) {
			const guild = await Guild.findById(guildId);

			const activeVoiceUsers = JSON.parse(guild.activeVoiceUsers) || {};

			if (oldChannelID && activeVoiceUsers[oldChannelID] !== undefined) {
				activeVoiceUsers[oldChannelID] = activeVoiceUsers[oldChannelID].filter(
					(user) => user !== userId
				);

				if (activeVoiceUsers[oldChannelID].length === 0) {
					delete activeVoiceUsers[oldChannelID];
				}
			}

			if (newChannelID) {
				if (activeVoiceUsers[newChannelID] === undefined) {
					activeVoiceUsers[newChannelID] = [];
				}
				activeVoiceUsers[newChannelID].push(userId);
			}

			guild.activeVoiceUsers = JSON.stringify(activeVoiceUsers);

			guild.save();
		}
	}
};
