const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

const { colors } = require("../../../config.json");

module.exports = async (client, interaction) => {
	axios.defaults.headers.get["X-Riot-Token"] = process.env.RIOT_TOKEN;
	const summoner = interaction.options.getString("summoner");

	await axios
		.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`)
		.then(res => {
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(colors.success)
						.setAuthor({ name: "Summoner info" })
						.setTitle(`${JSON.stringify(res.data.name)}`)
						.setURL(`https://euw.op.gg/summoners/euw/${JSON.stringify(res.data.name)}`)
						.setDescription(`Nivel: ${JSON.stringify(res.data.summonerLevel)}`)
						.setThumbnail(
							`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${JSON.stringify(
								res.data.profileIconId
							)}.png`
						),
				],
			});
		})
		.catch(error => {
			if (error.response.status == 404) {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(colors.danger)
							.setAuthor({ name: "Summoner info" })
							.setTitle("Summoner not found!")
							.setDescription("Check the summoner name and try again!")
							.setThumbnail(
								"https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png"
							),
					],
					ephemeral: true,
				});
			}
		});
};
