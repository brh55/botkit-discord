
function botDefinition (botkit, configuration) {
	const bot = {
		type: 'discord',
		botkit: botkit,
		config: configuration || {},
		utterance: botkit.utterance
	}

	const discordClient = botkit.config.client;

	bot.send = (message, cb) => {
		console.log(message);
		discordClient.sendMessage({
			to: message.to,
			message: message.text
		}, cb);
	}

	bot.reply = (src, resp, cb) => {
		const message = {};
		if (typeof(resp) == 'string') {
			message.text = resp;
		} else {
			message = resp;
		}

		if (src.type === 'direct_mention') {
			message.to = src.author.id;
		}

		if (
			src.type === 'mention' ||
			src.type === 'direct_mention'
		) {
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