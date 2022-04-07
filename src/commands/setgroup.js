const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    let channelCategory = commands.msg.guild.channels.cache.find(c => c.id === commands.args[0].trim());

    if (typeof channelCategory !== 'object') {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x: Invalid channel category ID.`)
            ]
        });

        return;
    }
    
    global.config.props.channel_category = channelCategory.id;
    global.config.update();

    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#5cb85c')
            .setDescription(`:white_check_mark: New channel category${typeof commands.args[0] === 'undefined' ? ' created and' : ''} set as thread category.`)
        ]
    });
};