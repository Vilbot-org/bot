import DeferErrors from './DeferErrors';

export default class extends DeferErrors {
	constructor(title, message) {
		super(title, message, 'Music Error');
	}
}
