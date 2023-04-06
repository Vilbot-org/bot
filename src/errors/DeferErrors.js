export default class extends Error {
	constructor(title, message, name) {
		super(message);
		this.title = title;
		this.name = name;
	}
}
