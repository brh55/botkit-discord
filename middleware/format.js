// Will format soon
// Will add more formating options
const format = (bot, message, platform_message) => {
	platform_message.channel = message.channel;
	platform_message.text = message.response.text;
	// Accepted responses
	platform_message.options = message.response;
	return platform_message;
};

module.exports.handler = (bot, message, platform_message, next) => {
	format(bot, message, platform_message);
	next();
}

module.exports.exec = format;
