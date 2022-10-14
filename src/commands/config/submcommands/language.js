const { EmbedBuilder } = require("discord.js");

const { colors } = require("../../../config.json");
const { setLanguage } = require("../../../structures/Language");

const language = require("../../../structures/Language");

module.exports = async (client, interaction, snipe) => {
	const languageToSet = interaction.options.getString("language");

	let guildData = await snipe.findOneAndUpdate({ _id: interaction.guild.id }, { language: languageToSet });

	if (!guildData) {
		guildData = await new snipe({
			_id: interaction.guild.id,
			language: languageToSet,
		});
		await guildData.save();
	}

	setLanguage(interaction.guild.id, languageToSet);

	return await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(colors.green)
				.setAuthor({ name: language(interaction.guild.id, "config.language.success") })
				.setTitle(language(interaction.guild.id, "config.language.set", languageToSet.toUpperCase()))
				.setThumbnail(interaction.guild.iconURL()),
		],
	});
};
