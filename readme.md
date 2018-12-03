# botkit-discord

> 🤖👾 A Botkit connector for Discord

This Botkit connector would not be possible without the powerful and simple library, [izy521/discord.io](https://github.com/izy521/discord.io). 

> Note this is still a work in progress and open to additional features and suggestions

![Example Image](https://user-images.githubusercontent.com/6020066/49334369-4151ba80-f589-11e8-8b8a-0086bcd956a2.png)

## Usage

```javascript
const BotkitDiscord = require('botkit-discord');
const config = {
    token: '**' // Discord bot token
}

const discordBot = BotkitDiscord(config);

discordBot.hears('hello','direct_message',(bot, message) => {
    bot.reply('how goes there :)!')
});
```

Refer to [Botkit documentation](https://botkit.ai/docs/) to utilize all of the other Botkit features.

## Events
You can handle particular events for your bot using the `.on()` method.

```js
discordBot.on(EVENT_NAME, event => {
	// do stuff
});
```

### Incoming Events

| Event          | Description                                                  |
| -------------- | ------------------------------------------------------------ |
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

For convenience the following methods from discord.io library is available on the `controller.api`

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

## License

Ⓒ MIT ([Brandon Him / brh55](github.com/@brh55))

Please let me know if you plan on forking or would like professional support.
