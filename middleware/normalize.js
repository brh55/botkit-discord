const processDefault = message => {
	const messageType = message.raw_message.channel.type;

	if (messageType=== 'text') {
		formatChannelMessage(message)
	}

	if (messageType === 'dm') {
		formatDirectMessage(message)
	}

	// All standard across both types
	const raw = message.raw_message;

	message.channel = raw.channel;
	message.member = raw.member;
	message.id = raw.id
	message.lastMessageID = raw.channel.lastMessageID;
	message.text = raw.content;
	message.mentions = raw.mentions;
	message.createdTimestamp = raw.createdTimestamp;
	message.editedTimestamp = raw.editedTimestamp;
	message.attachments = raw.attachments;
	message.embeds = raw.embeds;
	message.reactions = raw.reactions;
	message.nonce = raw.nonce
	message.pinned = raw.pinned || false;

	return message;
}

// 'dm' channel
const formatDirectMessage = message => {
	const raw = message.raw_message;
	message.type = raw.channel.type;
	message.lastMessage = raw.channel.lastMessage;
	message.user = raw.channel.recipient

	return message;
}

// 'text' channel
const formatChannelMessage = message => {
	const raw = message.raw_message;
	message.type = raw.channel.type;
	message.guildId = raw.channel.guild.id
	message.guild = raw.channel.guild;
	// to remain similar to other platforms (i.e facebook)
	message.user = raw.author;

	return message;
}

const normalize = (bot, message) => {
	// Message received
	if (message.raw_message.type === 'DEFAULT') {
		processDefault(message);
	}

	return message;
};

module.exports.handler = function (bot, message, next) {
	normalize(bot, message);
	next();
};

module.exports.exec = normalize;
