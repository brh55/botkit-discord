const isMention = (id, messageText) => messageText.indexOf(id) !== -1;
const isDirectMention = (id, messageText) => messageText.indexOf(id) === 2;

// Recategorize
const categorize = (bot, message) => {
	const botId = bot.botkit.config.client.user.id;

	if (message.type == 'text'
		&& message.guildId) {
		message.type = 'ambient';
	}

	if (
		message.type === 'dm' &&
		!message.guildId &&
		message.user.id !== botId
	) {
		message.type = 'direct_message';
	}

	if (isMention(botId, message.text)) {
		message.type = 'mention';

		if (isDirectMention(botId, message.text)) {
			message.type = 'direct_mention';
		}
	}

	return message;
};

module.exports.handler = (bot, message, next) => {
	categorize(bot, message);
	next();
};

module.exports.exec = categorize;
