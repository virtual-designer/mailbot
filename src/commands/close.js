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

    global.db.serialize(async () => {
        global.db.get("SELECT * FROM threads WHERE id = ?", [commands.args[0].trim()], async (err, data) => {
            if (err) {
                console.log(err);
            }

            if (data === undefined) {
                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                        .setColor('#f14a60')
                        .setDescription(`:x:\tThe thread with ID \`${commands.args[0].trim()}\` doesn't exist.`)
                    ]
                });        

                return;
            }

            if (data.status === 0) {
                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                        .setColor('#f14a60')
                        .setDescription(`:x:\tThe thread with ID \`${commands.args[0].trim()}\` is already closed.`)
                    ]
                });        

                return;
            }

            global.db.get("UPDATE threads SET status = 0 WHERE id = ?", [commands.args[0].trim()], async (err) => {
                if (err) {
                    console.log(err);
                }

                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                        .setColor('#5cb85c')
                        .setDescription(`The thread has been closed.`)
                        .addField('ID', data.id + '')
                    ]
                });
            });
        });
    });    
};