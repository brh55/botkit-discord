import test from 'ava';
import { platform } from 'os';

const middlewares = require('./middleware');

// These are standard properties that exist in all types
const checkStandardProperties = (t, message) => {
	t.is(message.text, 'this is an ambient message');
	t.is(message.channel.name, 'foobar');
}

test('Normalize: Process Text Channel', t => {
	const mockNormalize = require('./mocks/normalize-ambient');
	const normalizedAmbient = middlewares.normalize.exec({}, mockNormalize);

	t.is(normalizedAmbient.user.id, '237437571875995648');
	t.is(normalizedAmbient.user.username, 'codingbyhim');
	t.is(normalizedAmbient.type, 'text');
	t.is(normalizedAmbient.guild.name, 'foobar');
	t.is(normalizedAmbient.guild.id, "1234");

	checkStandardProperties(t, normalizedAmbient);
});

test('Normalize: Process DM Channel', t => {
	const mockNormalize = require('./mocks/normalize-dm');
	const normalizedDM = middlewares.normalize.exec({}, mockNormalize);

	t.is(normalizedDM.type, 'dm');
	t.is(normalizedDM.lastMessage, 'sample');
	t.is(normalizedDM.user.username, 'codingbyhim');

	checkStandardProperties(t, normalizedDM);
});

test('Categorize: Check Accurate Types', t => {
	const mockNormalize = require('./mocks/normalize-ambient');
	const normalizedAmbient = middlewares.normalize.exec({}, mockNormalize);

	const botStub = {
		botkit: {
			config: {
				client: {
					user: {
						id: 123456
					}
				}
			}
		}
	};

	const ambientMessage = Object.assign({}, normalizedAmbient);
	ambientMessage.guildId = '123456';
	const ambientMessageCategorize = middlewares.categorize.exec(botStub, ambientMessage);
	t.is(ambientMessageCategorize.type, 'ambient');

	// Format the normalized ambient message to meet direct_message criteria
	const insertMessage = normalizedAmbient;
	insertMessage.type = 'dm';
	delete insertMessage.guildId;
	const messageRecieved = middlewares.categorize.exec(botStub, insertMessage);
	t.is(messageRecieved.type, 'direct_message');

	insertMessage.text = '<@123456> hello!';
	const directMention = middlewares.categorize.exec(botStub, insertMessage);
	t.is(directMention.type, 'direct_mention');

	insertMessage.text = 'hello! <@123456>';
	const mentionMessage = middlewares.categorize.exec(botStub, insertMessage);
	t.is(mentionMessage.type, 'mention');
});

test('Format: Ensure Response Present', t => {
	const mockNormalize = require('./mocks/normalize-ambient');
	const normalizedAmbient = middlewares.normalize.exec({}, mockNormalize);
	normalizedAmbient.response = {
		text: "hello back"
	};
	const platformMessage = middlewares.format.exec({}, normalizedAmbient, {});

	t.is(platformMessage.channel.id, '518588622123827211');
	t.is(platformMessage.text, 'hello back');
});
