const snipe = require("../schemas/GuildsConfigsSchema");

const guildLanguages = {};

const loadLanguages = async client => {
	for (const guild of client.guilds.cache) {
		const guildId = guild[0];

		const result = await snipe.findOne({ _id: guildId });

		guildLanguages[guildId] = result ? result.language : "en";
	}
};

const setLanguage = (guildId, language) => {
	guildLanguages[guildId] = language;
};

module.exports = (guildId, message, ...vars) => {
	const language = guildLanguages[guildId];

	const messages = require(`../languages/${language}.json`);

	let translatedMessage = "";
	if (vars.length > 0) {
		let count = 0;
		translatedMessage = messages[message].replace(/%VAR%/g, () =>
			vars[count] !== null ? vars[count] : "%VAR%"
		);
	} else {
		translatedMessage = messages[message];
	}

	return translatedMessage;
};

module.exports.loadLanguages = loadLanguages;
module.exports.setLanguage = setLanguage;
