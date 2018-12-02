const Botkit = require('botkit');
const Discord = require('discord.io');

const middleware = require('./middleware');
const botDefinition = require('./bot');

const newMessageHandler = (req, res, controller) => {
	const payload = req.body;
	const bot = controller.spawn({});
	controller.ingest(bot, payload, res);
}

const DiscordBot = (configuration) => {
	const client = new Discord.Client({
		token: configuration.token,
		autorun: true
	});
	configuration.client = client;

	const discordBotkit = Botkit.core(configuration || {});
	discordBotkit.defineBot(botDefinition);
	// Attach Handlers and Middlewares
	discordBotkit.handleMessageRecieve = newMessageHandler;
	discordBotkit.middleware.normalize.use(middleware.normalize.handler);
	discordBotkit.middleware.categorize.use(middleware.categorize.handler);
    discordBotkit.middleware.format.use(middleware.format.handler);

	// discord.io forwarding and event handling
	// may move this elsewhere
	client.on('ready', event => {
		// Add some additional data to make it easier to work with
		const readyEvent = Object.assign({}, event, {
			username: client.username,
			id: client.id
		});
		discordBotkit.trigger('ready', [discordBotkit, readyEvent])
		discordBotkit.log('Logged in as %s - %s\n', client.username, client.id);
	});

	client.on('message', (user, userID, channelID, message, event) => {
		const req = {
			body: {
				user, userID, channelID, message, event
			}
		};
		discordBotkit.handleMessageRecieve(req, {}, discordBotkit);
	});

	client.on('disconnect', (errMsg, code) => {
		const event = {
			message: errMsg,
			code
		};
		discordBotkit.trigger('disconnect', [discordBotkit, event]);
	});

	// Stay Alive Please
	discordBotkit.startTicking();

	return discordBotkit
};