import { EmbedBuilder } from "discord.js";

import config from "../../../app.config";

export default async (client, interaction, snipe) => {
	const playlistName = interaction.options.getString("name")
		? interaction.options.getString("name")
		: `${interaction.user.username}-playlist`;

	//Check if this playlist already exist
	const data = await snipe.findOne({ userId: interaction.user.id, playlistName: playlistName });
	if (data)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setColor(config.colors.danger)
					.setTitle(
						interaction.options.getString("name")
							? ":x: A playlist with that name already exists!"
							: ":x: You already have your default playlist created"
					),
			],
			ephemeral: true,
		});

	let embedMsg = new EmbedBuilder();
	//Create new playlist if the user don't have a playlist with that name
	const newPlaylist = new snipe({
		userId: interaction.user.id,
		playlistName: playlistName,
		public: true,
		playlist: [],
	});
	await newPlaylist
		.save()
		.then(
			embedMsg
				.setColor(config.colors.green)
				.setAuthor({ name: "Create a new playlist" })
				.setTitle(`A playlist '${playlistName}' has been created sucessfully!`)
				.setDescription(
					"Now you can add new song in your playlist with the command: `/playlist add [song] " +
						playlistName +
						"`"
				)
				.setFooter({ text: "Type `/playlist help` to display more info" })
		)
		.catch(error => {
			embedMsg
				.setColor(config.colors.danger)
				.setAuthor({ name: "Error!" })
				.setTitle(":x: An error occurred while creating your playlist")
				.setDescription("Please wait a moment and try again.");
		});

	return await interaction.reply({ embeds: [embedMsg], ephemeral: true });
};
