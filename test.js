import test from 'ava';

const middlewares = require('./middleware');
const mockNormalize = require('./mocks/normalize-message');
const normalized = middlewares.normalize.exec({}, mockNormalize);

test('Test normalization', t => {
	t.is(normalized.author.username, 'brh55');
	t.is(normalized.channelId, '518198744815108126');
	t.is(normalized.text, 'Give me some mock data!');
});

test('Test categorization', t => {
	const botStub = {
		botkit: {
			config: {
				client: {
					id: 123456
				}
			}
		}
	};

	const ambientMessage = Object.assign({}, normalized);
	ambientMessage.guildId = '123456';
	const ambientMessageCategorize = middlewares.categorize.exec(botStub, ambientMessage);
	t.is(ambientMessageCategorize.type, 'ambient');

	const insertMessage = normalized;
	const messageRecieved = middlewares.categorize.exec(botStub, insertMessage);
	t.is(messageRecieved.type, 'direct_message');

	insertMessage.text = '<@123456> hello!';
	const directMention = middlewares.categorize.exec(botStub, insertMessage);
	t.is(directMention.type, 'direct_mention');

	insertMessage.text = 'hello! <@123456>';
	const mentionMessage = middlewares.categorize.exec(botStub, insertMessage);
	t.is(mentionMessage.type, 'mention');
});