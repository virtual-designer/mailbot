const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    global.config.props.show_command_not_found_message = !global.config.props.show_command_not_found_message;
    global.config.update();

    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#5cb85c')
            .setDescription(`${global.config.props.show_command_not_found_message ? ":white_check_mark:" : ":x:"}\Command not found warning has been ${global.config.props.show_command_not_found_message ? "enabled" : "disabled"}.`)
        ]
    });
};