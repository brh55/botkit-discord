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
	configuration.replyToSelf = configuration.replyToSelf || false;

	const discordBotkit = Botkit.core(configuration || {});
	discordBotkit.defineBot(botDefinition);

	// Pass along classes
	discordBotkit.RichEmbed = Discord.RichEmbed;
	discordBotkit.Attachment = Discord.Attachment;

	// Attach Handlers and Middlewares
	discordBotkit.handleMessageReceive = newMessageHandler;
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
		
		// Bot replies to itself with the same message
		// Can allow this by enabling it in the configuration
		if (
			message.author.id === configuration.client.user.id &&
			configuration.replyToSelf === false) {
			discordBotkit.debug(`Message received from bot, set configuration.replyToSelf to true to allow processing`);
			return;
		}

		discordBotkit.handleMessageReceive(message, discordBotkit);
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
