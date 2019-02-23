// Will format soon
// Will add more formating options
const format = (bot, message, platform_message) => {
	platform_message.to = message.to;
	platform_message.text = message.text;
	return message;
};

module.exports.handler = (bot, message, platform_message, next) => {
	format(bot, message, platform_message);
	next();
}

module.exports.exec = format;
