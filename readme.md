# botkit-discord

> 🤖👾 A Botkit connector for Discord with support for text, voice, attachments, embedded messages, and more.

[![Travis (.org)](https://img.shields.io/travis/brh55/botkit-discord.svg?style=flat-square)](https://travis-ci.org/brh55/botkit-discord) [![Coveralls branch](https://img.shields.io/coveralls/brh55/botkit-discord/master.svg?style=flat-square)](https://coveralls.io/github/brh55/botkit-discord) [![npm badge](https://img.shields.io/npm/dt/botkit-discord.svg?style=flat-square)](https://www.npmjs.com/package/botkit-discord)



This Botkit platform connector is intended to be used for Discord. Underneath the hood, this connector is utilizing [discord.js](https://github.com/discordjs/discord.js). Currently the connector supports the following features:

- **Text:** DM Channel, Group DM Channel, Guild Text Message
- **Voice:** Audio Playback and Joining Audio Channels
- **Embedded Messages:** Visually rich messages
- **File attachments:** Attach files to be downloaded by receiver
- **Various Notifications:** Presences, Guild Member Add/Remove/Update, Guild Role Changes, Channel Add/Delete/Create

![Example Gif](http://g.recordit.co/WzQ3XkJm5A.gif)

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
					if (numberRating.length < 1) {
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

### Discord.js Events

Along with standard events, all Discord.js events have been migrated for your use. Please refer to the [docs](https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate) for usage.

Server Greeting Referenced in [Docs](https://github.com/discordjs/discord.js/blob/stable/docs/examples/greeting.js)

```js
discordBot.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}`);
});
```

- "channelCreate"
- "channelDelete"
- "channelPinsUpdate"
- "channelUpdate"
- "clientUserGuildSettingsUpdate"
- "clientUserSettingsUpdate"
- "debug"
- "disconnect"
- "emojiCreate"
- "emojiDelete"
- "emojiUpdate"
- "error"
- "guildBanAdd"
- "guildBanRemove"
- "guildCreate"
- "guildDelete"
- "guildMemberAdd"
- "guildMemberAvailable"
- "guildMemberRemove"
- "guildMembersChunk"
- "guildMemberSpeaking"
- "guildMemberUpdate"
- "guildUnavailable"
- "guildUpdate"
- "message"
- "messageDelete"
- "messageDeleteBulk"
- "messageReactionAdd"
- "messageReactionRemove"
- "messageReactionRemoveAll"
- "messageUpdate"
- "presenceUpdate"
- "rateLimit"
- "ready"
- "reconnecting"
- "resume"
- "roleCreate"
- "roleDelete"
- "roleUpdate"
- "typingStart"
- "typingStop"
- "userNoteUpdate"
- "userUpdate"
- "voiceStateUpdate"
- "warn"

## Audio/Voice Functionalities
This connector utilizes the built-in [`discord.js` audio functionality](https://discord.js.org/#/docs/main/stable/topics/voice), but requires additional steps to work properly:

1. First install a desired audio enconder either `node-opus` or `opusscript` (discord.js recommends `node-opus` for performance reasons, but `opusscript` works for development purposes)
    - `npm install node-opus`
    - `npm install opusscript` 
2. Next install FFMPEG, you can choose any of the following methods:
    1. (Mac) Install through homebrew: `brew update && brew install ffmpeg`
    2. (Linux) Install through `apt update && apt install ffmpeg`
    3. (All) [Download and install](https://ffmpeg.org/download.html) the binaries manually through the FFMPEG site
    
For convenience, you'll be able to use the voice functionality if the sender of the message is already in a voice channel. This will be available in the `.api` properties of the bot object passed as a parameter in the event handler.

- `joinVoiceChannel()`
- `leaveVoiceChannel()`

Example Usage:
```js
discordBot.hears('!audio', 'ambient', (bot, message) => {
    if (!bot.api.joinVoiceChannel) {
       return bot.reply(message, 'I would if you were in a voice channel!');
    }

    bot.api.joinVoiceChannel().then(connection => {
        dispatcher = connection.play('./music/troll.mp3')
        dispatcher.setVolume(0.5)
     }).catch(err => {
        console.log(`Failed to play audio: ${err}`);
     });
})
```

## Embeds
To use embeds, it's preferred to use the Discord.js RichEmbed builder, `discordBot.RichEmbed()`.

![image](https://user-images.githubusercontent.com/6020066/55299068-0dc35780-53e6-11e9-9828-8676119e56a7.png)


```js
discordBot.hears('!rpg', ['direct_message', 'ambient'], (bot, message) => {
	const embed = new discordBot.RichEmbed()
	embed.setAuthor(
		"Quick RPG Stats",
		"https://rpglink.com/icon/here"
	);

	embed.addField("Power Level 👊", "Equivalent to a Goblin Archer 🏹");
	embed.addField("Skills Acquired 🥕", "🏹 Archery, 🍳 Cooking");
	embed.setColor('GREEN');
	bot.reply(message, embed)
});

```

## Atachments
It's recommended to use the attachment helper, `discordBot.Attachment`:

![image](https://user-images.githubusercontent.com/6020066/55299122-4fec9900-53e6-11e9-9f8c-f4d235ff15a7.png)

```js
discordBot.hears('!file', ['direct_message', 'ambient'], (bot, message) => {
	const attachment = new discordBot.Attachment('./temp.js', "Awesome Script!")
	bot.reply(message, attachment)
});
```

## License

Ⓒ MIT [Brandon Him / brh55](http://github.com/brh55)

Please let me know if you plan on forking or would like professional support. Open-source is a hobby, but it would be great as a full-time gig :)

This wouldn't be possible without all the tremendous effort and contributors behind [discord.js](https://github.com/discordjs/discord.js).

