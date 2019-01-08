
function botDefinition (botkit, configuration) {
	const bot = {
		type: 'discord',
		botkit: botkit,
		config: configuration || {},
		utterance: botkit.utterance
	}

	const discordClient = botkit.config.client;

	bot.send = (message, cb) => {
		discordClient.sendMessage({
			to: message.to,
			message: message.text
		}, cb);
	}

	bot.reply = (src, resp, cb) => {
		let message = {};
		if (typeof(resp) == 'string') {
			message.text = resp;
		} else {
			message = resp;
		}

		switch(src.type) {
				case 'direct_message':
				case 'direct_mention':
					// In these two cases, we reply directly to the Author with a Direct Message
					message.to = src.author.id;
					break;
				case 'mention':
				case 'ambient':
					// If the bot was just mentioned or if it's a channel message, we reply in the channel
					message.to = src.channelId;
					break;
				default:
					message.to = src.channelId;
			}

		bot.say(message, cb);
	}

	bot.findConversation = function(message, cb) {
		for (var t = 0; t < botkit.tasks.length; t++) {
			for (var c = 0; c < botkit.tasks[t].convos.length; c++) {
				if (
					botkit.tasks[t].convos[c].isActive() &&
					botkit.tasks[t].convos[c].source_message.user == message.user &&
					botkit.excludedEvents.indexOf(message.type) == -1 // this type of message should not be included
				) {
					cb(botkit.tasks[t].convos[c]);
					return;
				}
			}
		}
		cb();
	};
	

	return bot;
};

module.exports = botDefinition;