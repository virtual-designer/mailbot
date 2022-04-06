const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#007bff')
        ]
    });
};