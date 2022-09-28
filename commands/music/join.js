const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
	name: "Join",
	desc: "Command for the bot to join the voice channel.",
	run: async (message, args) => {
		const voiceChannel = message.member.id;

		console.log(voiceChannel);

		if (!voiceChannel || voiceChannel.type != "voice")
			message.channel.send("!Necesitas estar en un canal de voz!");
		else if (message.guild.voiceConnection) message.channel.send("!Ya estoy en un canal de voz!");
		else {
			message.channel
				.send("Conectando...")
				.then(m => {
					voiceChannel
						.join()
						.then(() => {
							m.edit(":white_check_mark: | Conectado exitosamente.");
						})
						.catch(err => message.channel.send(err));
				})
				.catch(err => message.channel.send(err));
		}
	},
};
