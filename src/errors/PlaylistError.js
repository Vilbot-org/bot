import CustomErrors from './CustomErrors';

export default class extends CustomErrors {
	constructor(title, message) {
		super(title, message, 'Playlist Error');
	}
}
