const axios = require("axios");
require("dotenv").config();

const embed = require("../../../structures/EmbedMessages");

module.exports = async (client, interaction) => {
	axios.defaults.headers.get["X-Riot-Token"] = process.env.RIOT_TOKEN;
	const summoner = interaction.options.getString("summoner");

	await axios
		.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner}`)
		.then(res => {
			const message = {
				title: `Perfil de ${JSON.stringify(res.data.name)}`,
				description: `Nivel: ${JSON.stringify(res.data.summonerLevel)}`,
				image: `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${JSON.stringify(
					res.data.profileIconId
				)}.png`,
			};
			const embedMsg = embed(message, "success");

			interaction.reply({ embeds: [embedMsg] });
		})
		.catch(error => {
			if (error.response.status == 404) {
				const message = {
					title: "¡No se encontro invocador!",
					description: "Revisa el nombre de invocador e intentalo de nuevo!",
					image: "https://cdn.hugocalixto.com.br/wp-content/uploads/sites/22/2020/07/error-404-1.png",
				};
				const embedMsg = embed(message, "danger");

				interaction.reply({
					embeds: [embedMsg],
				});
			}
		});
};
