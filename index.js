const Botkit = require('botkit');
const Discord = require('discord.js');

const middleware = require('./middleware');
const botDefinition = require('./bot');

var fs = require('fs')
const util = require('util')

const newMessageHandler = (message, controller) => {
	const bot = controller.spawn({});
	controller.ingest(bot, message, {});
}

const DiscordBot = (configuration) => {
	const client = new Discord.Client({});
	configuration.client = client;

	const discordBotkit = Botkit.core(configuration || {});
	discordBotkit.defineBot(botDefinition);
	discordBotkit.api = require('./api')(client);
	// Attach Handlers and Middlewares
	discordBotkit.handleMessageRecieve = newMessageHandler;
	discordBotkit.middleware.normalize.use(middleware.normalize.handler);
	discordBotkit.middleware.categorize.use(middleware.categorize.handler);
	discordBotkit.middleware.format.use(middleware.format.handler);

	client.on('ready', () => {
		discordBotkit.trigger('ready', [discordBotkit, client.user])
		discordBotkit.log('Logged in as %s - %s\n', client.user.username, client.user.id);
	});

	client.on('message', (message) => {
		discordBotkit.handleMessageRecieve(message, discordBotkit);
	});

	// client.on('disconnect', (errMsg, code) => {
	// 	const event = {
	// 		message: errMsg,
	// 		code
	// 	};
	// 	discordBotkit.trigger('disconnect', [discordBotkit, event]);
	// });

	// client.on('presence', (user, userID, status, game, event) => {
	// 	const presenceEvent = event.d;
	// 	discordBotkit.trigger('presence', [discordBotkit, event]);
	// });

	// client.on('guildMemberAdd', member => discordBotkit.trigger('guild_member_add', [discordBotkit, member]));
	// client.on('guildMemberUpdate', (oldMember, newMember) => 
	// 	discordBotkit.trigger('guild_member_update', [discordBotkit, { oldMember, newMember }]
	// ));
	// client.on('guildMemberRemove', member => discordBotkit.trigger('guild_member_remove', [discordBotkit, member]));

	// client.on('guildRoleCreate', role => discordBotkit.trigger('guild_role_create', [discordBotkit, role]));
	// client.on('guildRoleUpdate', (oldRole, newRole) => discordBotkit.trigger('guild_role_update', [discordBotkit, { oldRole, newRole }]));
	// client.on('guildRoleDelete', role => discordBotkit.trigger('guild_role_delete', [discordBotkit, role]));

	// client.on('channelCreate', channel => discordBotkit.trigger('guild_role_create', [discordBotkit, channel]));
	// client.on('channelUpdate', (newChannel, oldChannel) => discordBotkit.trigger('guild_role_update', [discordBotkit, { newChannel, oldChannel }]));
	// client.on('channelDelete', channel => discordBotkit.trigger('guild_role_delete', [discordBotkit, channel]))
	
	// Stay Alive Please
	client.login(configuration.token);
	discordBotkit.startTicking();

	return discordBotkit
};

module.exports = DiscordBot;