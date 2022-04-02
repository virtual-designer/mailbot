const discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const commands = require('./commands');

if (fs.existsSync(path.resolve(__dirname, "..", ".env"))) {
    console.log("Loading env file...");
    const dotenv = require("dotenv");
    dotenv.config();
}

const client = new discord.Client({
     intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    commands.init();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;

    commands.setMessage(message);

    let exists = commands.exists();
    let valid = commands.isValid();

    if (valid && exists) {
        await commands.execute();
    }
    else if (valid && !exists) {
        await message.reply({
            embeds: [
                (new discord.MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tThe command \`${commands.commandName}\` could not be found.`)
            ]
        });
    }
});

client.login(process.env.TOKEN);