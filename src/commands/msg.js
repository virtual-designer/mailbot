const { MessageEmbed, MessageActionRow, ButtonInteraction, MessageButton } = require('discord.js');
const widgetManager = require('../widgetManager');

module.exports = async (commands) => {
    let id = typeof commands.args[0] === 'undefined' ? undefined : commands.args[0];

    if (id === undefined) {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tThe command \`${commands.commandName}\` requires at least one argument.`)
            ]
        });

        return;
    }

    let embed = (new MessageEmbed())
                .setColor('#007bff');

    global.db.serialize(() => {
        widgetManager.createMessageWidget(embed, id, async (e) => {
            if (e === null) {
                global.tmp.data.next = 0;
            }

            await commands.msg.reply({
                embeds: [e === null ? (
                    new MessageEmbed()
                    .setDescription("Message not found.")
                    .setColor("#f14a60")
                ) : e],
            });
        });
    });
};