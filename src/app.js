const discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const keepAlive = require('./server');

keepAlive();

const config = require('./config');
config.load();
global.config = config;

const tmp = require('./tmp');
tmp.init();
global.tmp = tmp;

const commands = require('./commands');
global.commands = commands;
const dm = require('./dm');
const updateDM = require('./updateDM');
const database = require('./database');
const { db } = require('./database');

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

    client.user.setActivity("DM me to contact staff!", { type: "PLAYING" });

    commands.init();
    database.init();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot)
        return;

    if (global.config.props.guild_id === '-' && !message.content.startsWith('-setup')) {
        await message.reply({
            embeds: [
                (new discord.MessageEmbed())
                .setColor('#007bff')
                .setDescription("Setup required! Run `-setup` to complete setup.")
            ]
        });

        return;
    }

    commands.setMessage(message);

    if (message.channel.type === 'dm' || message.guild === null) {
        dm.init(message);
        dm.handle();
        return;
    }

    let exists = commands.exists();
    let valid = commands.isValid();
    let allowedInChannel = commands.isAllowedInChannel();
    let allowed = commands.isAllowed();

    if (valid && exists && allowed && allowedInChannel) {
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
    else if (config.get('debug') == true && !allowedInChannel && allowed && exists && valid) {
        await message.reply({
            embeds: [
                (new discord.MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tCannot run command \`${commands.commandName}\` in this channel.`)
            ]
        });
    }
    else if (config.get('debug') == true && !allowed && exists && valid) {
        await message.reply({
            embeds: [
                (new discord.MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tYou don't have permission to run \`${commands.commandName}\` on this server.`)
            ]
        });
    }
});

client.on('messageUpdate', async (oldMessage, newMessage) => {
   if (oldMessage.channel.type !== 'DM' || oldMessage.guild !== null)
        return;

    await updateDM.handle(commands, oldMessage, newMessage);
});

client.login(process.env.TOKEN);