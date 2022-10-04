const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	//Check if the user can manage messages
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: You don't have permission to do that!"),
			],
			ephemeral: true,
		});

	const nMsgs = interaction.options.getInteger("amount") ? interaction.options.getInteger("amount") : 10;
	let allMsgs = [];
	let msgsToDelete = [];

	await interaction.channel.messages
		.fetch({ limit: nMsgs, cache: false })
		.then(messages => (allMsgs = messages))
		.catch(console.error);

	allMsgs.map(msg => {
		if (msg.author.id == client.user.id && !msg.pinned) msgsToDelete.push(msg);
	});

	if (msgsToDelete.length == 0) {
		return await interaction.reply({
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(`:x: There are no messages to delete!`)],
			ephemeral: true,
		});
	}

	await interaction.channel.bulkDelete(msgsToDelete);
	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setTitle(`:white_check_mark: ${msgsToDelete.length} messages have been successfully deleted!`),
		],
		ephemeral: true,
	});
};
