const loadApiMethods = require('../api');
// Attach some useful methods to bot for easier API usage
const receive = (bot, message) => {
	return message;
};

module.exports.handler = (bot, message, next) => {
	receive(bot, message);
	bot.api = loadApiMethods(bot, message);
	next();
};

module.exports.exec = receive;
