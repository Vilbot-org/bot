import 'dotenv/config';
import { cleanEnv, num, str, url } from 'envalid';

const env = cleanEnv(process.env, {
	APP_NAME: str(),
	APP_ENV: str({ choices: ['development', 'test', 'production', 'deploy'] }),
	DISCORD_TOKEN: str(),
	CLIENT_ID: num(),
	GUILD_ID: num(),
	DB_NAME: str(),
	DB_URI: url(),
	SOCKET_URL: url(),
	JWT_SECRET_KEY: str()
});

export default env;
