const { MessageEmbed } = require('discord.js');
const cmdMeta = require('../cmd-meta');

module.exports = async (commands) => {
    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#007bff')
            .setTitle('Mailbot')
            .setDescription("A free and open source bot for contacting server staff.")
            .addField('Version', cmdMeta.version)
            .addField('Support', cmdMeta.support)
            .setFooter({text: "Copyright (c) Ar Rakin 2022, All rights reserved"})
        ]
    });
};