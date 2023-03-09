import { EmbedBuilder } from "discord.js";

import config from "../../../app.config";

export default async (client, interaction, snipe) => {
	const playlistName = interaction.options.getString("name");

	//If you try to delete the default playlist
	if (playlistName == `${interaction.user.username}-playlist`)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(":x: You can't delete the default playlist!")
					.setDescription("Please try with another playlist."),
			],
			ephemeral: true,
		});

	const deletePlaylist = await snipe.findOneAndDelete({
		userId: interaction.user.id,
		playlistName: playlistName,
	});

	//Check if  exist this playlist
	if (deletePlaylist)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.green)
					.setAuthor({ name: "Delete the playlist" })
					.setTitle(`A playlist '${playlistName}' has been deleted sucessfully!`)
					.setFooter({ text: "Type `/playlist help` to display more info" }),
			],
			ephemeral: true,
		});
	else
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setAuthor({ name: "Error" })
					.setTitle("You don't have any playlist with this name!")
					.setDescription("Please check the name with the command `/playlist list` and try again")
					.setFooter({ text: "Type `/playlist help` to display more info" }),
			],
			ephemeral: true,
		});
};
