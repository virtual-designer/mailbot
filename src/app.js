const discord = require('discord.js');
const fs = require('fs');
const path = require('path');

const config = require('./config');
config.load();
global.config = config;

const tmp = require('./tmp');
tmp.init();
global.tmp = tmp;

const commands = require('./commands');
const dm = require('./dm');
const database = require('./database');

if (fs.existsSync(path.resolve(__dirname, "..", ".env"))) {
    console.log("Loading env file...");
    const dotenv = require("dotenv");
    dotenv.config();
}

const client = new discord.Client({
    partials: ["CHANNEL"],
    intents: [
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_MESSAGES,
        discord.Intents.FLAGS.DIRECT_MESSAGES, 
        discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

global.client = client;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    commands.init();
    database.init();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;

    commands.setMessage(message);

    if (message.channel.type === 'dm' || message.guild === null) {
        dm.init(message);
        dm.handle();
        return;
    }

    let exists = commands.exists();
    let valid = commands.isValid();

    if (valid && exists) {
        await commands.execute();
    }
    else if (valid && !exists && config.get('show_command_not_found_message', false)) {
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