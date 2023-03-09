import { EmbedBuilder } from "discord.js";

import config from "../../../app.config";

export default async (client, interaction, snipe) => {
	const playlists = await snipe.find({ userId: interaction.user.id });
	const embedMsg = new EmbedBuilder()
		.setColor(config.colors.info)
		.setAuthor({ name: "List of playlist" })
		.setTitle(`${interaction.user.username} playlists:`)
		.setThumbnail(interaction.user.avatarURL())
		.setFooter({ text: "Type `/music playlist <playlist-name>` to listen to a playlist!" });

	if (playlists.length == 0)
		return await interaction.reply({
			embeds: [
				embedMsg.setDescription(
					"Oops! You still don't have playlists\nType`/playlist create <playlist-name>` to create a new playlist."
				),
			],
			ephemeral: true,
		});

	const embedFields = [];
	for (const playlist of playlists) {
		embedFields.push({
			name: `- ${playlist.playlistName}`,
			value: playlist.playlist.length == 0 ? "Empty playlist" : `${playlist.playlist.length} song`,
		});
	}

	return await interaction.reply({ embeds: [embedMsg.addFields(embedFields)], ephemeral: true });
};
