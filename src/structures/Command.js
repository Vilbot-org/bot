module.exports = class Command {
	constructor(client, options) {
		this.client = client;
		this.options = options;
		this.name = options.name;
		this.description = options.description;
		this.options = options.options;
		this.default_member_permissions = options.default_member_permissions;
	}
};
