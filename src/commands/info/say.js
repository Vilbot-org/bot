module.exports = {
	name: "Ping",
	desc: "Command to view the ping in the bot.",
	run: async (message, args) => {
		let messageToSend = "";
		args.forEach(arg => {
			messageToSend = `${messageToSend} ${arg}`;
		});

		message.channel.send(messageToSend);
	},
};
