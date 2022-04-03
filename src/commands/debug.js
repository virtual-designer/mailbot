const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    global.config.props.debug = !global.config.props.debug;
    global.config.update();

    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#5cb85c')
            .setDescription(`${global.config.props.debug ? ":white_check_mark:" : ":x:"}\tDebug mode has been ${global.config.props.debug ? "enabled" : "disabled"}.`)
        ]
    });
};