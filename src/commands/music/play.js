import { useMainPlayer as player } from 'discord-player';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import config from '@/app.config';
import { play } from '@/functions/musicUtils';

export default {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song in the voice channel!')
		.addStringOption((option) =>
			option
				.setName('song')
				.setDescription('Enter the name of the song  or the URL.')
				.setRequired(true)
				.setAutocomplete(true)
		),

	async autocomplete(interaction) {
		const focusedOption = interaction.options.getFocused(true);

		if (focusedOption.name === 'song') {
			const searchResult = await player().search(focusedOption.value);

			if (searchResult.hasTracks()) {
				await interaction.respond(
					searchResult.tracks.slice(0, 4).map((track) => ({
						name: track.title,
						value: track.title
					}))
				);
			}
		}
	},

	async execute(interaction) {
		const query = interaction.options.getString('song');
		const { channel } = interaction.member.voice;

		await interaction.deferReply();

		const { queue, track } = await play(query, interaction.guildId, channel.id);

		await interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setAuthor({ name: 'Add to the queue' })
					.setTitle(`${track.title}`)
					.setURL(`${track.url}`)
					.setThumbnail(`${track.thumbnail}`)
					.setFields(
						{ name: 'Duration', value: `${track.duration}`, inline: true },
						{
							name: 'Position in the queue',
							value: `${queue.getSize() > 0 ? queue.getSize() : 'Playing now'}`,
							inline: true
						}
					)
					.setFooter({
						text:
							queue.getSize() >= 1
								? `Next song in the queue: ${queue.tracks.at(0).title}`
								: 'This is the first song in the queue.'
					})
			]
		});
	}
};
