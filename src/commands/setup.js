const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    global.config.props.guild_id = commands.msg.guild.id;

    await global.config.update();
    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#007bff')
            .setDescription(':white_check_mark: Setup Complete!')
        ]
    });
};