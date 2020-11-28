const Botkit = require('botkit');
const Discord = require('discord.js');
const discordEvents = require('./discord-events');
const middleware = require('./middleware');
const botDefinition = require('./bot');

const newMessageHandler = (message, controller) => {
	const bot = controller.spawn({});
	const source = {
		raw: message
	}

	controller.ingest(bot, {}, source);
};

const DiscordBot = (configuration) => {
	const client = new Discord.Client({});
	configuration.client = client;

	const discordBotkit = Botkit.core(configuration || {});
	discordBotkit.defineBot(botDefinition);

	// Pass along classes
	discordBotkit.MessageEmbed = Discord.MessageEmbed;
	discordBotkit.MessageAttachment = Discord.MessageAttachment;

	// Attach Handlers and Middlewares
	discordBotkit.handleMessageRecieve = newMessageHandler;
	discordBotkit.middleware.ingest.use(middleware.ingest.handler);
	discordBotkit.middleware.normalize.use(middleware.normalize.handler);
	discordBotkit.middleware.categorize.use(middleware.categorize.handler);
	discordBotkit.middleware.format.use(middleware.format.handler);
	discordBotkit.middleware.receive.use(middleware.receive.handler);

	client.on('ready', () => {
		discordBotkit.trigger('ready', [discordBotkit, client.user])
		discordBotkit.log('Logged in as %s - %s\n', client.user.username, client.user.id);
	});

	client.on('message', async message => {
		discordBotkit.debug(`Received ${message}`);
		discordBotkit.handleMessageRecieve(message, discordBotkit);
	});

	// Set up triggers for remaining events
	discordEvents.map(event => {
		client.on(event, (...params) => {
			discordBotkit.trigger(event, [discordBotkit, params]);
		});
	});

	if (configuration.debug) {
		client.on('debug', info => {
			discordBotkit.debug(info);
			discordBotkit.trigger('debug', [discordBotkit, info]);
		});
	}

	// Stay Alive Please
	client.login(configuration.token);
	discordBotkit.startTicking();

	return discordBotkit
};

module.exports = DiscordBot;
