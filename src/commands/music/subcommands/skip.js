import { ButtonBuilder } from '@discordjs/builders';
import { EmbedBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';

import config from '../../../app.config';
import errorHandler from '../../../handlers/errorHandler';

export default async (interaction, queue) => {
	if (!queue || queue.isEmpty()) throw new Error('no-songs-queue');

	const skipingMessage = new EmbedBuilder()
		.setColor(config.colors.success)
		.setAuthor({ name: 'Skipping the song' })
		.setTitle(`:track_next: ${queue.tracks.at(0).title}`)
		.setURL(`${queue.tracks.at(0).url}`)
		.setDescription(
			queue.getSize() > 1
				? `The next song is: [${queue.tracks.at(1).title}](${
						queue.tracks.at(1).url
						// eslint-disable-next-line no-mixed-spaces-and-tabs
				  })`
				: 'There are no more songs in the queue!'
		);

	const membersInVoice = interaction.member.voice.channel.members.map(
		(member) => member.user.id
	);

	//The votation dont start if have less than 4 persons in the voice channel (include the bot)
	if (membersInVoice.length < 4) {
		await queue.node.skip();
		await interaction.reply({ embeds: [skipingMessage] });
		return;
	}

	//Votation to skip the current song
	const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('yes')
				.setLabel('Yes')
				.setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId('no')
				.setLabel('No')
				.setStyle(ButtonStyle.Danger)
		);

	//Send the votation
	const votingMessage = await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(config.colors.info)
				.setTitle('Votation to skip the current song')
				.setDescription(`Do you want to skip the current song?`)
		],
		components: [row],
		fetchReply: true
	});

	let votes = 0;
	const requiredVotes = Math.ceil((membersInVoice.length - 1) / 2);
	const membersAlreadyVoted = [];

	//Create the collector and set the duration in 1min
	const filter = async (i) => {
		const validInteraction = i.isButton() && i.message.id === votingMessage.id;
		const memberInVoice = membersInVoice.indexOf(i.user.id) !== -1;
		const memberAlreadyVoted = membersAlreadyVoted.indexOf(i.user.id) !== -1;

		try {
			//Check if the user are in the voice channel
			if (!memberInVoice) throw new Error('in-voice-channel');
			//Check if the user already voted
			if (memberAlreadyVoted) throw new Error('already-vote');
		} catch (e) {
			errorHandler(i, e);
		}

		return validInteraction && memberInVoice && !memberAlreadyVoted;
	};
	const collector = await votingMessage.createMessageComponentCollector({
		filter,
		time: 60000
	});

	//Listened the collected events
	collector.on('collect', async (i) => {
		if (i.customId === 'yes') {
			votes += 1;
			membersAlreadyVoted.push(i.user.id);
		}

		await i.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.info)
					.setTitle('Thanks for voting!')
			],
			ephemeral: true
		});

		if (votes >= requiredVotes) collector.stop();
	});

	//After the event ended the voting was removed
	collector.on('end', async () => {
		if (votes >= requiredVotes) {
			await interaction.channel.send({
				embeds: [skipingMessage]
			});
			await queue.node.skip();
		}

		await interaction.deleteReply();
	});
};
