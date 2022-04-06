const { MessageEmbed } = require('discord.js');
const cmdMeta = require('../cmd-meta');

module.exports = async (commands) => {
    if (typeof commands.args[0] === 'undefined') {
        let description = 'A discord bot for contacting server staff by DM.\n**All available commands are listed below.** Run `' + global.config.props.prefix + 'help <commandName>` to get more detailed information.';

        for await (let cmd of cmdMeta.data) {
            description += `\n\n**${global.config.props.prefix + cmd.name}**\n${cmd.description}`;
        }

        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#007bff')
                .setTitle('Help')
                .setDescription(description)
            ]
        });
    }
    else {
        let command = commands.args[0].trim();

        if (typeof commands.commands[command] === 'undefined') {
            await commands.msg.reply({
                embeds: [
                    (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`:x:\tThe command \`${commands.args[0].trim()}\` could not be found.`)
                ]
            });

            return;
        }

        let help = cmdMeta.findByName(command);

        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#007bff')
                .setTitle(`${global.config.props.prefix}${help.name}`)
                .setDescription(help.description)
                .addField('Usage', '`' + help.usage.replace(/\%\%/g, global.config.props.prefix) + '`')
                .addField('Example', '`' + help.examples.replace(/\%\%/g, global.config.props.prefix) + '`')
                .addField('Notes', typeof help.notes === 'undefined' ? '*No notes*' : help.notes)
            ]
        });
    }
};