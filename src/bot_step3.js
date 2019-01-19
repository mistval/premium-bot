const eris = require('eris');
const { BOT_TOKEN, BOT_OWNER_ID } = require('../config.json');

const PREFIX = 'pb!';

const bot = new eris.Client(BOT_TOKEN);

const commandForName = {};
commandForName['addpayment'] = {
  botOwnerOnly: true,
  execute: (msg, args) => {
    const mention = args[0];
    const amount = parseFloat(args[1]);

    // TODO: Handle invalid arguments, such as:
    // 1. No mention or invalid mention.
    // 2. No amount or invalid amount.

    return msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`);
  },
};

bot.on('messageCreate', async (msg) => {
  try {
    const content = msg.content;

    // Ignore any messages sent as direct messages.
    // The bot will only accept commands issued in
    // a guild.
    if (!msg.channel.guild) {
      return;
    }

    // Ignore any message that doesn't start with the correct prefix.
    if (!content.startsWith(PREFIX)) {
      return;
    }

    // Extract the name of the command
    const parts = content.split(' ').map(s => s.trim()).filter(s => s);
    const commandName = parts[0].substr(PREFIX.length);

    // Get the requested command, if there is one.
    const command = commandForName[commandName];
    if (!command) {
      return;
    }

    // If this command is only for the bot owner, refuse
    // to execute it for any other user.
    const authorIsBotOwner = msg.author.id === BOT_OWNER_ID;
    if (command.botOwnerOnly && !authorIsBotOwner) {
      return await msg.channel.createMessage('Hey, only my owner can issue that command!');
    }

    // Separate the command arguments from the command prefix and name.
    const args = parts.slice(1);

    // Execute the command.
    await command.execute(msg, args);
  } catch (err) {
    console.warn('Error handling message create event');
    console.warn(err);
  }
});

bot.on('error', err => {
  console.warn(err);
});

bot.connect();
