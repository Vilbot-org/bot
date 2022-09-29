module.exports = class Command {
	constructor(client, options) {
		this.client = client;
		this.name = options.name;
		this.description = options.description;
	}
};
