const eris = require('eris');
const webhookListener = require('./webhook_listener.js');
const { BOT_OWNER_ID, BOT_TOKEN, LOG_CHANNEL_ID } = require('../config.json');

const PREFIX = 'pb!';
const PREMIUM_CUTOFF = 10;

const bot = new eris.Client(BOT_TOKEN);

const premiumRole = {
  name: 'Premium Member',
  color: 0x6aa84f,
  hoist: true, // Show users with this role in their own section of the member list.
};

async function updateMemberRoleForDonation(guild, member, donationAmount) {
  // If the user donated more than $10, give them the premium role.
  if (guild && member && donationAmount >= PREMIUM_CUTOFF) {
    // Get the role, or if it doesn't exist, create it.
    let role = Array.from(guild.roles.values())
      .find(role => role.name === premiumRole.name);

    if (!role) {
      role = await guild.createRole(premiumRole);
    }

    // Add the role to the user, along with an explanation
    // for the guild log (the "audit log").
    return member.addRole(role.id, 'Donated $10 or more.');
  }
}

const commandForName = {};
commandForName['addpayment'] = {
  botOwnerOnly: true,
  execute: (msg, args) => {
    const mention = args[0];
    const amount = parseFloat(args[1]);
    const guild = msg.channel.guild;
    const userId = mention.replace(/<@!?(.*?)>/, (match, group1) => group1);
    const member = guild.members.get(userId);

    const userIsInGuild = !!member;
    if (!userIsInGuild) {
      return msg.channel.createMessage('User not found in this guild.');
    }

    const amountIsValid = amount && !Number.isNaN(amount);
    if (!amountIsValid) {
      return msg.channel.createMessage('Invalid donation amount');
    }

    return Promise.all([
      msg.channel.createMessage(`${mention} paid $${amount.toFixed(2)}`),
      updateMemberRoleForDonation(guild, member, amount),
    ]);
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

function findUserInString(str) {
  const lowercaseStr = str.toLowerCase();
  // Look for a username in the form of username#discriminator.
  const user = bot.users.find(
    user => lowercaseStr.indexOf(`${user.username.toLowerCase()}#${user.discriminator}`) !== -1,
  );
  return user;
}

function logDonation(member, donationAmount, paymentSource, paymentId, senderName, message, timestamp) {
  const isKnownMember = !!member;
  const memberName = isKnownMember ? `${member.username}#${member.discriminator}` : 'Unknown';
  const embedColor = isKnownMember ? 0x00ff00 : 0xff0000;

  const logMessage = {
    embed: {
      title: 'Donation received',
      color: embedColor,
      timestamp: timestamp,
      fields: [
        { name: 'Payment Source', value: paymentSource, inline: true },
        { name: 'Payment ID', value: paymentId, inline: true },
        { name: 'Sender', value: senderName, inline: true },
        { name: 'Donor Discord name', value: memberName, inline: true },
        { name: 'Donation amount', value: donationAmount.toFixed(2), inline: true },
        { name: 'Message', value: message, inline: true },
      ],
    },
  };

  return bot.createMessage(LOG_CHANNEL_ID, logMessage);
}

async function onDonation(
  paymentSource,
  paymentId,
  timestamp,
  amount,
  senderName,
  message,
) {
  try {
    const user = findUserInString(message);
    const guild = user ? bot.guilds.find(guild => guild.members.has(user.id)) : null;
    const guildMember = guild ? guild.members.get(user.id) : null;

    return await Promise.all([
      updateMemberRoleForDonation(guild, guildMember, amount),
      logDonation(guildMember, amount, paymentSource, paymentId, senderName, message, timestamp),
    ]);
  } catch (err) {
    console.warn('Error updating donor role and logging donation');
    console.warn(err);
  }
}

webhookListener.on('donation', onDonation);
bot.connect();
