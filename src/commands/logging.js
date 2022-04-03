const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    if (typeof commands.args[0] === 'undefined') {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tThe command \`${commands.commandName}\` requires at least one argument.`)
            ]
        });

        return;
    }

    const channel = global.client.channels.cache.find(ch => ch.id === commands.args[0].trim());

    if (typeof channel === 'undefined') {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tThe given channel doesn't exist or missing permissions.`)
            ]
        });

        return;
    }

    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#5cb85c')
            .setDescription(`:white_check_mark:\tThe given channel has been set as logging channel.`)
        ]
    });

    await channel.send({
        embeds: [
            (new MessageEmbed())
            .setColor('#5cb85c')
            .setDescription(`:white_check_mark:\tThe channel is accessible.`)
        ]
    });
};