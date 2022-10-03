const { EmbedBuilder, PermissionsBitField } = require("discord.js");

const { colors } = require("../../../../config.json");

module.exports = async (client, interaction) => {
	const nMsgs = interaction.options.getInteger("amount") ? interaction.options.getInteger("amount") : 10;
	//Check if the user can moderate
	if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
		return await interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(colors.danger).setTitle(":x: You don't have permission to do that!"),
			],
			ephemeral: true,
		});

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
			embeds: [new EmbedBuilder().setColor(colors.danger).setTitle(`:x: there are no messages to delete!`)],
		});
	}

	await interaction.channel.bulkDelete(msgsToDelete);
	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.success)
				.setTitle(`:white_check_mark: ${nMsgs} have been successfully deleted!`),
		],
	});
};
