const { MessageEmbed, MessageActionRow, ButtonInteraction, MessageButton } = require('discord.js');
const { findThreadChannelCategory } = require('../channelManager');
const channelManager = require('../channelManager');
const { generate } = require('../log');
const widgetManager = require('../widgetManager');

async function inner(commands, message, threadChannel, id, i, a) {
    await db.get('SELECT * FROM threads WHERE status = 1 ORDER BY id DESC LIMIT 0, 1', async (err, data) => {    
        await db.get("INSERT INTO replies(content, user, user_id, date, thread_id, msg_id) VALUES(?, ?, ?, ?, ?, ?)", [
            message,
            commands.msg.author.tag,
            commands.msg.author.id,
            (new Date()).toISOString(),
            data.id,
            commands.msg.id
        ], async (err) => {
            await db.get('SELECT * FROM replies WHERE thread_id = ? AND msg_id = ? ORDER BY id DESC', [data.id, commands.msg.id], async (err, data2) => {
                if (a !== undefined) {
                    await threadChannel.send({
                        embeds: [
                            (new MessageEmbed())
                            .setColor('#007bff')
                            .setTitle("New Thread")
                            .setDescription('This is the start of the thread conversation. Use `-rta <message>` to send a message.')
                            .setAuthor({
                                name: id.tag,
                                iconURL: id.displayAvatarURL()
                            })
                            .addField("Thread ID", data.id + "")
                            .setFooter({text: 'Created'})
                            .setTimestamp()
                        ]
                    });
                }

                await threadChannel.send({
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#5cb85c')
                            .setAuthor({
                                iconURL: commands.msg.author.displayAvatarURL(),
                                name: commands.msg.author.tag
                            })
                            .setDescription(message)
                            .addField("Thread ID", data.id + "")
                            .addField("Message ID", data2.id + "")
                            .setTimestamp()
                            .setFooter({
                                text: i === 2 ? 'Anonymous Reply' : 'Normal Reply',
                            })
                    ]
                });

                const channel = await global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                if (typeof channel !== 'undefined') {
                    if (a !== undefined) {
                        let obj = {
                            embeds: [
                                (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setTitle("New thread created by staff")
                                    .addField("Created by", commands.msg.author.tag)
                                    .addField("DMing to", id.tag)
                                    .addField("Thread ID", data.id + "")
                                    .setTimestamp()
                                    .setFooter({
                                        text: 'Created',
                                    })
                            ]
                        };
                    
                        generate(obj);
    
                        await channel.send(obj);
                    }

                    obj = {
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#007bff')
                                .setTitle("Reply Sent")
                                .setDescription(message)
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
                    if (a !== undefined) {
                        await user.send({
                            embeds: [
                                (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setDescription('New thread created')
                            ]
                        });
                    }

                    const msg = await user.send({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#007bff')
                                .setAuthor({
                                    name: i === 2 ? 'Staff' : commands.msg.author.tag,
                                    iconURL: i === 2 ? client.user.avatarURL() : commands.msg.author.displayAvatarURL(),
                                })
                                .setDescription(message)
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
                        .setColor('#007bff')
                        .setDescription('New ' + (a !== undefined ? 'thread created' : 'message sent') + '. Go to <#' + threadChannel.id + '> to start conversation with ' + id.user.tag)
                        .addField('Thread ID', data.id + '')
                    ]
                });
            });
        });
    });
}

module.exports = async (commands) => {
    let id = typeof commands.args[0] === 'undefined' ? undefined : commands.args[0];

    if (id === undefined) {
        id = commands.msg.mentions?.first();
        id = id === null ? undefined : id;
    }
    else {
        try {
            id = await commands.msg.guild.members.fetch(id);
        }
        catch (e) {
            console.log(e);

            await commands.msg.reply({
                embeds: [
                    (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`:x:\tInvalid user ID given.`)
                ]
            });
    
            return;
        }
    }

    let i = 1;

    if (commands.args[1] === '-a')
        i = 2;

    if (id === undefined || commands.args[i] === undefined) {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tThe command \`${commands.commandName}\` requires at two one arguments.`)
            ]
        });

        return;
    }

    let args = [...commands.args];
    args.shift();

    if (i === 2) {
        args.shift();
    }

    let message = args.join(' ');

    await global.db.serialize(async () => {
        id.tag = id.user.username + '#' + id.user.discriminator;
        
        db.get('SELECT * FROM threads WHERE status = 1 AND user = ? ORDER BY id DESC', [id.tag], async (err, data) => {
            if (data === undefined) {
                let threadChannel = await channelManager.createThread({
                    author: id.user
                });
        
                await global.db.get("INSERT INTO threads(user, user_id, date, channel_id) VALUES(?, ?, ?, ?)", [id.user.tag, id.user.id, (new Date()).toISOString(), threadChannel.id], async (err) => {
                    if (err) {
                        console.log('Query failed: dm.js: ' + err);
                    }
        
                    console.log('created');

                    await inner(commands, message, threadChannel, id, i, 1);
                });
            }
            else {
                console.log(data);
                let threadChannel = await findThreadChannelCategory(data.channel_id);
                await inner(commands, message, threadChannel, id, i);
            }
        });
    });
};