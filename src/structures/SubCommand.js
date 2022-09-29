module.exports = class SubCommand {
	constructor(name, baseCommand, groups, groupCommands) {
		this.name = name;
		this.baseCommand = baseCommand;
		this.groups = groups;
		this.groupCommands = groupCommands;
	}
};
