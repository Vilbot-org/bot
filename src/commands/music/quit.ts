import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField
} from 'discord.js';
import config from '@/app.config';
import Command from '@/classes/Command';
import { getVoiceChannel } from '@/utils/guildUtils';
import { quit } from '@/utils/musicUtils';

const execute = async (interaction: ChatInputCommandInteraction) => {
	const voiceChannel = getVoiceChannel(interaction);
	quit(voiceChannel);

	await interaction.reply({
		embeds: [
			new EmbedBuilder().setColor(config.colors.success).setAuthor({
				name: interaction.user.username,
				iconURL: interaction.user.displayAvatarURL()
			}).setDescription(`
          **Vilbot has been disconnected!**
          :wave: Bye, bye!`)
		]
	});
};

const quitCommandOptions = {
	name: 'quit',
	description: 'Disconnect the bot of music!',
	execute: execute,
	permissions: [PermissionsBitField.Flags.ModerateMembers]
};
const quitCommand = new Command(quitCommandOptions);

export default quitCommand;
