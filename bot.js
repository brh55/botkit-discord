
function botDefinition (botkit, configuration) {
	const bot = {
		type: 'discord',
		botkit: botkit,
		config: configuration || {},
		utterance: botkit.utterance
	}

	bot.send = (message, cb) => {
		if (typeof cb !== 'function') {
			cb = (err, resp) => {
				if (err) {
					return botkit.debug('Message failed to send: ', err);
				}

				botkit.debug('Message successfully sent: ', resp);
			}
		}
		const messageOptions = message.embed || message.attachment || message.options;
		message.channel.send(message.text, messageOptions)
			.then(success => cb(null, success))
		 	.catch(cb);
	}

	bot.reply = (src, resp, cb) => {
		const message = resp;
		if (typeof(resp) == 'string') {
			message.text = Object.assign({}, resp);
		}

		src.response = message;
		// sends to format middle before sent
		bot.say(src, cb);
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
