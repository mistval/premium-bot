# Premium Bot

This repo contains the code used in [How to Make a Discord Bot: an Overview and Tutorial](https://www.toptal.com/chatbot/how-to-make-a-discord-bot) on the Toptal Engineering Blog.

Premium Bot is an example bot that helps manage donations and donor roles in a Discord server.

## How to run this code

Source code is included for every step presented in the tutorial part of the blog post.

After cloning the repo, install dependencies with `npm install`.

Provide your bot token, Discord user ID, and the ID of your log channel in **config.json**. If you have publicly forked this repo, be sure to remove **config.json** from source control.

The final code can then be run with `npm start` or `node src/bot.js`.

Code for other steps can be run with `node src/bot_step1.js`, `node src/bot_step2.js`, etc.

## Updates

July 21, 2020 - Updated Eris to the latest version.
