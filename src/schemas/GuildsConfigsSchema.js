const { Schema, model } = require("mongoose");

const GuildsConfigsSchema = new Schema({
	//Guild Id
	_id: String,
	language: String,
});

module.exports = model("GuildsConfigs", GuildsConfigsSchema);
