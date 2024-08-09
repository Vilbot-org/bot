import type { IUser } from './IBot';

export interface IPlaylist extends Document {
	user: IUser;
	name: string;
	tracks: string[];
}
