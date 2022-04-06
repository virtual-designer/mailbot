const { MessageEmbed } = require('discord.js');

module.exports = async (commands) => {
    let roleID = undefined;
    let roleMention = commands.msg.mentions.roles?.first(); 

    if (roleMention !== undefined && roleMention !== null && typeof roleMention === 'object') {
        roleID = roleMention.id;
    }
    else if (typeof commands.args[0] !== 'undefined' && commands.args[0].trim() !== '' && commands.args[0].trim() !== '-') {
        let role = commands.msg.guild.roles.cache.find(r => r.id === commands.args[0]);

        if (typeof role === 'object' && role !== null) {
            roleID = role.id;
        }
        else {
            await commands.msg.reply({
                embeds: [
                    (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`The given role was invalid.`)
                ]
            });

            return;
        }
    }

    global.config.props.role = typeof roleID === 'undefined' ? '-' : roleID;
    global.config.update();

    await commands.msg.reply({
        embeds: [
            (new MessageEmbed())
            .setColor('#5cb85c')
            .setDescription(`${global.config.props.role !== '-' ? ":white_check_mark:" : ":x:"} ${global.config.props.role !== '-' ? "The given role has been set." : "The role constraint has been disabled."}`)
        ]
    });

    roleID = undefined;
};