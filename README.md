# Premium Bot

This repo contains the code used in [How to Make a Discord Bot: an Overview and Tutorial](https://www.toptal.com/chatbot/how-to-make-a-discord-bot) on the Toptal Engineering Blog.

Premium Bot is an example bot that helps manage donations and donor roles in a Discord server.

## DEPRECATION NOTICE

Hello people from 2023 and beyond! At the time of this writing, the code in this repo still works. However, the [eris bot library](https://abal.moe/Eris/docs) used heavily within is no longer actively maintained and I believe it is no longer suitable for building new Discord bots.

Therefore I have decided to deprecate and archive this repo.

[Discord.js](https://discord.js.org/#/) is the dominant Node.js library for building Discord bots, and their documentation is a great place to start for aspiring bot developers in 2023.

Eris does have at least a couple of successors:

1. [Oceanic](https://github.com/OceanicJS/Oceanic)
2. [Dysnomia](https://github.com/projectdysnomia/dysnomia)

## How to run this code

Source code is included for every step presented in the tutorial part of the blog post.

After cloning the repo, install dependencies with `npm install`.

Provide your bot token, Discord user ID, and the ID of your log channel in **config.json**. If you have publicly forked this repo, be sure to remove **config.json** from source control.

The final code can then be run with `npm start` or `node src/bot.js`.

Code for other steps can be run with `node src/bot_step1.js`, `node src/bot_step2.js`, etc.

## Updates

June 11, 2022 - Updated Eris to the latest version, updated package-lock.json format for NPM 7+.

April 24, 2021 - Updated Eris to the latest version.

July 21, 2020 - Updated Eris to the latest version, fixed missing return statement, fixed mention handling, used toFixed for string formatting.
