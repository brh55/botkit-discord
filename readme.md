# botkit-discord

> 🤖👾 A Botkit connector for Discord

This Botkit connector would not be possible without the powerful and simple library, [izy521/discord.io](https://github.com/izy521/discord.io). 

> Please Note: This is still a work in progress and I will continue to add more functionalities as I dig deeper into documentation.

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

*More to come (Audio, Voice, etc)* 

## License

Ⓒ MIT ([Brandon Him / brh55](github.com/@brh55))

Please let me know if you plan on forking or would like professional support.
