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

    db.get("SELECT * FROM replies WHERE id = ?", [commands.args[0]], async (err, data) => {
        db.all("SELECT * FROM history WHERE reply_id = ?", [data === undefined ? 0 : data.id], async (err, data2) => {
            if (typeof data === 'undefined') {
                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#f14a60')
                            .setDescription(`:x:\tThe reply with the given ID doesn't exist.`)
                    ]
                });
        
                return;
            }
            else {
                let fields = [];
                let i = 0;

                if (data2 !== undefined && data2.length > 0) {
                    for (let history of data2) {
                        fields.push({
                            name: (i + 1) + ` (${(new Date(history.date)).toUTCString()})`,
                            value: history.content
                        });

                        i++;
                    }
                }

                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#007bff')
                            .setTitle('Message History')
                            .setDescription(data.content)
                            .addFields(fields)
                            .setFooter({text: `Updated ${i} times`})
                    ]
                });
            }
        });
    });
};