import {
	ActivityType,
	Client,
	ClientOptions,
	Collection,
	Events,
	Guild,
	Interaction
} from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

import logger from '../utils/logger';
import Command from './Command';
import databaseConnection from '@/utils/databaseConnection';
import GuildModel from '@/models/Guild';
import { Player } from 'discord-player';
// import socket from '@/sockets';
import { Socket } from 'socket.io-client';

class BotClient extends Client {
	public player: Player | null = null;
	public slashCommandsMap = new Collection<string, Command>();
	public socket: Socket | null = null;

	constructor(options: ClientOptions) {
		super(options);
		this.player = new Player(this);
		this.player.extractors.loadDefault();
	}

	public async start(token: string) {
		this.registerListeners();

		await this.login(token);
	}

	private registerListeners() {
		this.on(Events.ClientReady, this.onReady);
		this.on(Events.GuildCreate, this.onGuildCreate);
		this.on(Events.InteractionCreate, this.onInteractionCreate);
	}

	private async loadCommands() {
		try {
			const path = join(__dirname, '..', 'tsCommands');
			const categories = readdirSync(path);

			await Promise.all(
				categories.map(async (category) => {
					const commandsPath = join(path, category);
					const commands = readdirSync(commandsPath).filter((file) =>
						file.endsWith('.ts')
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
			logger.error(`Failed to load events: ${error}`);
		}
	}

	private async onReady() {
		try {
			logger.info(`${this.user?.tag} is ready!`);
			this.user?.setActivity('/help', { type: ActivityType.Listening });

			await databaseConnection();
			this.loadCommands();
			/* this.socket = socket; */
		} catch (error) {
			logger.error(error);
		}
	}

	private async onGuildCreate(guild: Guild) {
		const newGuild = new GuildModel({
			_id: guild.id,
			name: guild.name
		});

		await newGuild.save();

		logger.info(`The "${newGuild.name}" guild was added.`);
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
