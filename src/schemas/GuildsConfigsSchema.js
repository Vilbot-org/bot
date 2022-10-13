const { Schema, model } = require("mongoose");

const GuildsConfigsSchema = new Schema({
	__id: String,
	language: String,
});

module.exports = model("GuildsConfigs", GuildsConfigsSchema);
