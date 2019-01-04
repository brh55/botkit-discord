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
	discordBotkit.api = require('./api')(client);
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

	client.on('presence', (user, userID, status, game, event) => {
		const presenceEvent = event.d;
		discordBotkit.trigger('presence', [discordBotkit, event]);
	});

	client.on('guildMemberAdd', member => discordBotkit.trigger('guild_member_add', [discordBotkit, member]));
	client.on('guildMemberUpdate', (oldMember, newMember) => 
		discordBotkit.trigger('guild_member_update', [discordBotkit, { oldMember, newMember }]
	));
	client.on('guildMemberRemove', member => discordBotkit.trigger('guild_member_remove', [discordBotkit, member]));

	client.on('guildRoleCreate', role => discordBotkit.trigger('guild_role_create', [discordBotkit, role]));
	client.on('guildRoleUpdate', (oldRole, newRole) => discordBotkit.trigger('guild_role_update', [discordBotkit, { oldRole, newRole }]));
	client.on('guildRoleDelete', role => discordBotkit.trigger('guild_role_delete', [discordBotkit, role]));

	client.on('channelCreate', channel => discordBotkit.trigger('guild_role_create', [discordBotkit, channel]));
	client.on('channelUpdate', (newChannel, oldChannel) => discordBotkit.trigger('guild_role_update', [discordBotkit, { newChannel, oldChannel }]));
	client.on('channelDelete', channel => discordBotkit.trigger('guild_role_delete', [discordBotkit, channel]))
	
	// Stay Alive Please
	discordBotkit.startTicking();

	return discordBotkit
};

module.exports = DiscordBot;