const isMention = (id, messageText) => messageText.indexOf(id) !== -1;
const isDirectMention = (id, messageText) => messageText.indexOf(id) === 2;

// can rename to something logical
const categorize = (bot, message) => {
	const botId = bot.botkit.config.client.id;

	if (
		message.raw_message.event.t == 'MESSAGE_CREATE' &&
		message.guideId
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
