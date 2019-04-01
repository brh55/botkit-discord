const joinVoiceChannel = (message) => async () => {
	if (!message.member.voiceChannel)
		throw Error('User is not in a voice channel');

	try {
		const connection = await message.member.voiceChannel.join();
		return connection;
	} catch (error) {
		throw Error(error);
	}
};

const leaveVoiceChannel = (message) => () => {
	const voiceChannel = message.member.voiceChannel;
	if (voiceChannel) {
		voiceChannel.leave();
	}
};

module.exports = (bot, message) => {
	// Direct message related APIs
	if (message.type === 'direct_message') {
		return {
		}
	}

	// Guild message types API (mentions, ambient)
	return {
		joinVoiceChannel: joinVoiceChannel(message),
		leaveVoiceChannel: leaveVoiceChannel(message)
	}
}
