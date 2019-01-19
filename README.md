# Premium Bot

This repo contains the code used in an upcoming Toptal Engineering Blog post about Discord Bots.

Premium Bot is an example bot that helps manage donations and donor roles in a Discord server.

## How to run this code

Source code is included for every step presented in the tutorial part of the blog post.

After cloning the repo, install dependencies with `npm install`.

The final code can then be run with `npm start` or `node src/bot.js`.

Code for other steps can be run with `node src/bot_step1.js`, `node src/bot_step2.js`, etc.

Make sure to provide your bot token, Discord user ID, and the ID of your log channel in **config.json**. Although the blog post shows these constants being hardcoded into bot.js so that they are easy to see, this repo has them in a **config.json** file so that they are easy to change. If you branch this repo, be sure to remove the config file from source control before entering your credentials.
