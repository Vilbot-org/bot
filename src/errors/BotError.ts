class BotError extends Error {
	public title: string;

	constructor(name: string, title: string, message: string) {
		super(message);
		this.title = title;
		this.name = name;
	}
}

export default BotError;
