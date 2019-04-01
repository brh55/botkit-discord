const format = (bot, message, platform_message) => {
	platform_message.channel = message.channel;
	// If reply is just a plain "string"
	if (typeof message.response === 'string') {
		platform_message.text = message.response;
		return platform_message;
	}

	// Accepted responses
	platform_message.options = message.response || {};
	return platform_message;
};

module.exports.handler = (bot, message, platform_message, next) => {
	format(bot, message, platform_message);
	next();
}

module.exports.exec = format;
