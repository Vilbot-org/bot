const axios = require("axios");
require("dotenv").config();

module.exports = async (client, interaction) => {
	axios.defaults.headers.get["X-Riot-Token"] = process.env.RIOT_TOKEN;
	const summoner = interaction.options.getString("summoner");

	await axios
		.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`)
		.then(res => {
			/* const embedMsg = new EmbedBuilder()
					.setTitle(`Perfil de ${JSON.stringify(res.data.name)}`)
					.setDescription(`Nivel: ${JSON.stringify(res.data.summonerLevel)}`)
					.setThumbnail(
						`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${JSON.stringify(
							res.data.profileIconId
						)}.png`
					);

				message.channel.send({ embeds: [embedMsg] }); */
			interaction.reply(
				`Summoner: ${JSON.stringify(res.data.name)} is lvl ${JSON.stringify(res.data.summonerLevel)} in lol!`
			);
		})
		.catch(error => {
			if (error.response.status == 404) {
				const embedMsg = new EmbedBuilder().setTitle("¡No se encontro invocador!");

				message.channel.send({
					embeds: [embedMsg],
				});
			}
		});
};
