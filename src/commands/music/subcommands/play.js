import { EmbedBuilder } from "discord.js";

import config from "../../../app.config";

export default async (client, interaction) => {
	const query = interaction.options.getString("song");
	const channel = interaction.member.voice.channel;

	await interaction.deferReply();

	try {
		const { queue, track } = await client.player.play(channel, query, {
			nodeOptions: {
				metadata: interaction,
				volume: 40,
			},
		});

		return interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.success)
					.setAuthor({ name: "Add to the queue" })
					.setTitle(`${track.title}`)
					.setURL(`${track.url}`)
					.setThumbnail(`${track.thumbnail}`)
					.setFields(
						{ name: "Duration", value: `${track.duration}`, inline: true },
						{
							name: "Position in the queue",
							value: `${queue.getSize() > 0 ? queue.getSize() : "Playing now"}`,
							inline: true,
						}
					)
					.setFooter({
						text:
							queue.getSize() >= 1
								? `Next song in the queue: ${queue.tracks.at(0).title}`
								: "This is the first song in the queue.",
					}),
			],
		});
	} catch (e) {
		return interaction.followUp(`Something went wrong: ${e}`);
	}
};
