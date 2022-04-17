const { MessageEmbed } = require('discord.js');
const { generate } = require('../log');

module.exports = async (commands) => {
    if (commands.msg.channel.parent.id !== global.config.props.channel_category) {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`:x:\tThe command \`${commands.commandName}\` must be runned inside a thread channel.`)
            ]
        });

        return;
    }

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
        global.db.get("SELECT * FROM threads WHERE channel_id = ? AND status = 1", [commands.msg.channel.id], async (err, data) => {
            if (err) {
                console.log(err);
            }

            if (data === undefined) {
                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#f14a60')
                            .setDescription(`:x:\tThe thread doesn't exist or has been closed.`)
                    ]
                });

                return;
            }

            const content = commands.args.join(' ');

            global.db.get("INSERT INTO replies(content, user, user_id, date, thread_id, msg_id) VALUES(?, ?, ?, ?, ?, ?)", [
                content,
                commands.msg.author.tag,
                commands.msg.author.id,
                (new Date()).toISOString(),
                data.id,
                commands.msg.id
            ], async (err) => {
                if (err) {
                    console.log(err);
                }

                db.get('SELECT * FROM replies ORDER BY id DESC LIMIT 0, 1', async (err, data2) => {
                    const channel = global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                    if (typeof channel !== 'undefined') {
                        let obj = {
                            embeds: [
                                (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setTitle("Reply Sent")
                                    .setDescription(content)
                                    .addField("Sent by", commands.msg.author.tag)
                                    .addField("Thread ID", data.id + "")
                                    .addField("Message ID", data2.id + "")
                                    .setTimestamp()
                                    .setFooter({
                                        text: 'Sent',
                                    })
                            ]
                        };
                    
                        generate(obj);

                        await channel.send(obj);
                    }

                    const user = client.users.cache.get(data.user_id);

                    if (typeof user !== 'undefined') {
                        const msg = await user.send({
                            embeds: [
                                (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setAuthor({
                                        name: 'Staff',
                                        iconURL: client.user.avatarURL(),
                                    })
                                    .setDescription(content)
                                    .setTimestamp()
                                    .setFooter({
                                        text: 'Received',
                                    })
                            ]
                        });

                        await db.get('UPDATE replies SET msg_id = ? WHERE id = ?', [msg.id, data2.id], async (err) => {});
                    }

                    await commands.msg.reply({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#5cb85c')
                                .setAuthor({
                                    iconURL: client.user.displayAvatarURL(),
                                    name: 'Staff'
                                })
                                .setDescription(content)
                                .addField("Thread ID", data.id + "")
                                .addField("Message ID", data2.id + "")
                                .setTimestamp()
                                .setFooter({
                                    text: 'Anonymous Reply',
                                })
                        ]
                    });
                });
            });
        });
    });
};