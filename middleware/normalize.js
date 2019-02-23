// can rename to something logical
const normalize = (bot, message) => {
	console.log(message)
	const rawMessage = message.raw_message;
	message.channel = rawMessage.channel;
	message.text = rawMessage.content;
	message.channelId = message.channel.id;
	message.guildId = message.event.d.guild_id || '';
	message.timestamp = message.event.d.timestamp;
	message.attachments = message.event.d.attachments;
	message.embeds = message.event.d.embeds;
	message.mentions = message.event.d.mentions;
	message.mentionRoles = message.event.d.mention_roles;
	message.mentionEveryone = message.event.d.mention_everyone;

	return message;
};

module.exports.handler = function (bot, message, next) {
	normalize(bot, message);
	next();
};

module.exports.exec = normalize;
