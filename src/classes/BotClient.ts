import {
	ActivityType,
	Client,
	ClientOptions,
	Collection,
	Events,
	Interaction
} from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Player } from 'discord-player';
import { Socket } from 'socket.io-client';

import logger from '../utils/logger';
import Command from './Command';
import databaseConnection from '@/utils/databaseConnection';
import {
	guildCreateEvent,
	guildDeleteEvent,
	voiceStateUpdateEvent
} from '@/events/clientEvents';
import registerPlayerEvents from '@/events/playerEvents';
import GuildModel from '@/models/Guild';
import { findDifferents } from '@/utils/guildUtils';
import { IBotToServerEvents, IServerToBotEvents } from '@/types/ISocket';
import registerSocketEvents from '@/sockets/socketEvents';
import socketConnection from '@/sockets/socketConnection';

class BotClient extends Client {
	public player: Player;
	public slashCommandsMap = new Collection<string, Command>();
	public socket: Socket<IServerToBotEvents, IBotToServerEvents>;

	constructor(options: ClientOptions) {
		super(options);
		this.player = new Player(this);
		this.player.extractors.loadDefault();
		this.socket = socketConnection();
	}

	public async start(token: string) {
		this.registerListeners();

		await this.login(token);
	}

	private registerListeners() {
		this.once(Events.ClientReady, this.onReady);
		this.on(Events.InteractionCreate, this.onInteractionCreate);
		this.on(Events.GuildCreate, guildCreateEvent);
		this.on(Events.GuildDelete, guildDeleteEvent);
		this.on(Events.VoiceStateUpdate, voiceStateUpdateEvent);
		registerPlayerEvents(this);
		registerSocketEvents(this);
	}

	private async loadCommands() {
		try {
			const path = join(__dirname, '..', 'commands');
			const categories = readdirSync(path);

			await Promise.all(
				categories.map(async (category) => {
					const commandsPath = join(path, category);
					const commands = readdirSync(commandsPath).filter(
						(file) => file.endsWith('.ts') || file.endsWith('.js')
					);

					await Promise.all(
						commands.map(async (command) => {
							const commandPath = join(commandsPath, command);
							const commandObject: Command = (await import(commandPath))
								.default;

							this.slashCommandsMap.set(
								commandObject.getCommandData().name,
								commandObject
							);

							logger.info(
								`Command ${
									commandObject.getCommandData().name
								} of the category ${category} are load!`
							);
						})
					);
				})
			);
		} catch (error) {
			logger.error(`Failed to load commands: ${error}`);
		}
	}

	private async onReady() {
		try {
			logger.info(`${this.user?.tag} is ready!`);
			this.user?.setActivity('/help', { type: ActivityType.Listening });

			await databaseConnection();
			this.loadCommands();

			const registeredGuilds = await GuildModel.find();
			const botGuilds = this.guilds.cache.toJSON();

			const unregisterGuilds = findDifferents(registeredGuilds, botGuilds) as {
				_id: string;
				name: string;
			}[];

			if (registeredGuilds.length > 0) {
				await GuildModel.insertMany(unregisterGuilds);
			}
		} catch (error) {
			logger.error(error);
		}
	}

	private async onInteractionCreate(interaction: Interaction) {
		if (!interaction.isAutocomplete() && !interaction.isChatInputCommand()) {
			return;
		}

		const command = this.slashCommandsMap.get(interaction.commandName);

		if (!command) return;

		if (interaction.isAutocomplete()) {
			await command.autocomplete(interaction);
		} else if (interaction.isChatInputCommand()) {
			await command.execute(interaction);
		}
	}
}

export default BotClient;
