# botkit-discord

> 🤖👾 A Botkit connector for Discord with support for text, voice, attachments, embedded messages, and more.

This Botkit platform connector is intended to be used for Discord. Underneath the hood, this connector is utilizing [discord.js](https://github.com/discordjs/discord.js). Currently the connector supports the following features:

- **Text:** DM Channel, Group DM Channel, Guild Text Message
- **Voice:** Audio Playback and Joining Audio Channels
- **Embedded Messages:** visually rich messages
- File attachments
- **Various Notifications:** Presences, Guild Member Add/Remove/Update, Guild Role Changes, Channel Add/Delete/Create

![Example Image](https://user-images.githubusercontent.com/6020066/49334369-4151ba80-f589-11e8-8b8a-0086bcd956a2.png)

## Install
`$ npm install botkit-discord`

## Basic Usage
```javascript
const BotkitDiscord = require('botkit-discord');
const config = {
    token: '**' // Discord bot token
}

const discordBot = BotkitDiscord(config);

discordBot.hears('hello','direct_message',(bot, message) => {
    bot.reply(message, 'how goes there :)!');
});

discordBot.hears('.*', 'direct_mention', (bot, message) => {
	bot.reply(message, 'leave me to be please.');
});
```

## Advance Usage
```javascript
const BotkitDiscord = require('botkit-discord');
const config = {
    token: '**' // Discord bot token
}

// Let's join the user's voice channel if we recieve a "b!play"
// play a song and leave, get rating from user, and save result
// if no rating is stored, we can end convoersation
discordBot.hears('b!play', 'ambient', (bot, message) => {
	bot.api.joinVoiceChannel().then(connection => {
		dispatcher = connection.play('./music/funny.mp3')
		dispatcher.setVolume(0.5)
		dispatcher.on('finish', () => {
			bot.createConversation(message, (err, convo) => {
				convo.addQuestion('How would rate that from a scale of 0 to 5?', (response, convo) => {
					const numberRating = response.text.match(/[0-5]/g);
					if (nummberRating.length < 1) {
						convo.say('Uhh... not a valid rating, try again later!');
						convo.next();
					}
					convo.say('Oh wow! Thanks for letting me know!');
					db.save(message.member.id, numberRating[0]);
					convo.next();
				});
			});
		})
		bot.api.leaveVoiceChannel();
	}).catch(err => {
		// If the user is not in a voice channel, tell them to join one
		bot.reply('Dude, you\'ll need to join a voice channel and try again');
	});
});
```
### Example Projects
- [Magic-8 Ball](https://github.com/brh55/discord-magic-8-ball)
- More to come...

Refer to [Botkit documentation](https://botkit.ai/docs/) to utilize all of the other Botkit features.

## Events
When you want your bot to respond to particular events that may be relevant, you can use the `.on` method.

```javascript
discordBot.on(EVENT_NAME, event => {
	// do stuff
});
```

### Incoming Events

| Event          | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| ambient        | a channel the bot is in has a new message                    |
| direct_message | the bot received a direct message from a user                |
| direct_mention | the bot was addressed directly in a channel ("@bot hello")   |
| mention        | the bot was mentioned by someone in a message ("hello @bot") |

 ### Bot Activity Events

| Event      | Description                             |
| ---------- | --------------------------------------- |
| disconnect | Bot has disconnected or failed to login |
| ready      | Bot is connected                        |

### Guild Events

> Guilds can also be referred to "server"

| Event               | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| guild_member_add    | A member added to guild (server)                             |
| guild_member_update | An existing guild member has bene updated                    |
| guild_member_remove | A member removed from guild                                  |
| guild_role_create   | A new [guild role](https://discordapp.com/developers/docs/topics/permissions#role-object) created |
| guild_role_update   | An existing guild role has been updated                      |
| guild_role_delete   | A guild role deleted                                         |
| channel_create      | A channel has been create                                    |
| channel_update      | An existing channel has been updated                         |
| channel_delete      | A channel has been deleted                                   |

## API

For convenience the following methods from discord.js ibrary is available on the `controller.api`

- setPresence
- editUserInfo
- getAllUsers
- fixMessage
- simulateTyping
- getMessage
- getMessages
- editMessage
- deleteMessage
- pinMessage
- deletePinnedMessage

## Bot Schema

## Text Channel

## Voice Channel

## Embeds

## Atachments

## License

Ⓒ MIT ([Brandon Him / brh55](github.com/@brh55))

Please let me know if you plan on forking or would like professional support.

This wouldn't be possible without all the tremendous effort and contributors behind[discord.js](https://github.com/discordjs/iscord.js).

