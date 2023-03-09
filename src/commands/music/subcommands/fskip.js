import { EmbedBuilder, PermissionsBitField } from "discord.js";

import config from "../../../app.config";

export default async (client, interaction, queue) => {
	const embedMsg = new EmbedBuilder().setTitle("Music queue!");

	if (!queue) {
		return await interaction.reply({
			embeds: [embedMsg.setColor(config.colors.danger).setDescription(":x: No songs in the queue!")],
			ephemeral: true,
		});
	}

	try {
		//Check if the user can moderate
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.colors.danger)
						.setTitle(":x: You don't have permission to do that!"),
				],
				ephemeral: true,
			});

		await queue.node.skip();

		let skipingMessage = new EmbedBuilder()
			.setColor(config.colors.success)
			.setAuthor({ name: "Forcing the skip of the song" });

		if (!queue.isEmpty()) {
			skipingMessage
				.setTitle(`:track_next: ${queue.tracks.at(0).title}`)
				.setURL(`${queue.tracks.at(0).url}`)
				.setDescription(
					queue.getSize() > 1
						? `The next song is:  [${queue.tracks.at(1).title}](${queue.tracks.at(1).url})`
						: "There are no more songs in the queue!"
				);
		} else {
			skipingMessage.setTitle(":wave: Bye bye!").setDescription("No more songs in the queue");
		}

		return await interaction.reply({
			embeds: [skipingMessage],
		});
	} catch (e) {
		return await interaction.reply(`Something went wrong: ${e}`);
	}
};
