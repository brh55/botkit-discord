// can rename to something logical
const normalize = (bot, message) => {
	console.log(message)
	// Clean up to make it easier to work with
	// copy over event.d upwards to main root
	message.text = message.content;
	message.channelId = message.channel.id;
	message.author = message.event.d.author;
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
