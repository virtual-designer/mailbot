const {MessageEmbed} = require('discord.js');

module.exports = async (commands) => {
    if (typeof commands.args[1] === 'undefined') {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`:x:\tThe command \`${commands.commandName}\` requires at least two arguments.`)
            ]
        });

        return;
    }

    global.db.serialize(async () => {
        global.db.get("SELECT * FROM replies WHERE id = ?", [commands.args[0].trim()], async (err, data) => {
            if (err) {
                console.log(err);
            }

            if (data === undefined) {
                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#f14a60')
                            .setDescription(`:x:\tThe message with ID \`${commands.args[0].trim()}\` doesn't exist.`)
                    ]
                });

                return;
            }

            const newContent = [...commands.args];
            newContent.shift();
            const content = newContent.join(' ');

            global.db.get("UPDATE replies SET content = ? WHERE id = ?", [
                content,
                data.id,
            ], async (err) => {
                if (err) {
                    console.log(err);
                }

                const channel = global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                if (typeof channel !== 'undefined') {
                    await channel.send({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#007bff')
                                .setTitle("Reply Updated")
                                .setDescription(content)
                                .addField("Updated by", commands.msg.author.tag)
                                .addField("Thread ID", data.thread_id + "")
                                .addField("Message ID", data.id + "")
                                .setTimestamp()
                                .setFooter({
                                    text: 'Updated',
                                })
                        ]
                    });
                }

                const user = client.users.cache.get(data.user_id);

                if (typeof user !== 'undefined') {
                    await user.send({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#007bff')
                                .setAuthor({
                                    name: 'Staff'
                                })
                                .setDescription(content)
                                .setTimestamp()
                                .setFooter({
                                    text: 'Received (Edited)',
                                })
                        ]
                    });
                }

                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#007bff')
                            .setTitle("Reply Updated")
                            .addField("Message ID", data.id + "")
                            .setTimestamp()
                            .setFooter({
                                text: 'Updated',
                            })
                    ]
                });
            });
        });
    });
};