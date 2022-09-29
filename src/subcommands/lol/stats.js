/* const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "Stats",
	desc: "Command to view the summoner stats",
	run: async (message, args) => {
		axios.defaults.headers.get["X-Riot-Token"] = "RGAPI-54cdabd7-b1e2-4d27-877c-0da4dd413fec";

		await axios
			.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${args[0]}`)
			.then(res => {
				const embedMsg = new EmbedBuilder()
					.setTitle(`Perfil de ${JSON.stringify(res.data.name)}`)
					.setDescription(`Nivel: ${JSON.stringify(res.data.summonerLevel)}`)
					.setThumbnail(
						`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${JSON.stringify(
							res.data.profileIconId
						)}.png`
					);

				message.channel.send({ embeds: [embedMsg] });
			})
			.catch(error => {
				if (error.response.status == 404) {
					const embedMsg = new EmbedBuilder().setTitle("¡No se encontro invocador!");

					message.channel.send({
						embeds: [embedMsg],
					});
				}
			});
	},
};


 */

const SubCommand = require("../../structures/SubCommand");

module.exports = class LolCommand extends SubCommand {
	constructor(client) {
		super(client, {
			name: "lol",
			description: "Look LoL info!",
			options: [
				{
					name: "stats",
					description: "See a stats of a specific summoner!",
					type: 1,
					required: true,
					options: [
						{
							name: "summoner",
							description: "The summoner name!",
							type: 3,
							required: true,
						},
					],
				},
			],
		});
	}

	run = interaction => {
		interaction.replay("lol");
	};
};
