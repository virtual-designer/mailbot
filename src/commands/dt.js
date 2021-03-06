const { MessageEmbed } = require('discord.js');
const { findThreadChannelCategory } = require('../channelManager');
const { generate } = require('../log');

module.exports = async (commands) => {
    if (commands.msg.channel?.parent?.id !== global.config.props.channel_category) {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`:x:\tThe command \`${commands.commandName}\` must be runned inside a thread channel.`)
            ]
        });

        return;
    }

        global.db.get("SELECT * FROM threads WHERE channel_id = ?", [commands.msg.channel.id], async (err, data) => {
            if (err) {
                console.log(err);
            }

            if (data === undefined) {
                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                        .setColor('#f14a60')
                        .setDescription(`:x:\tThe thread with ID \`${commands.msg.channel.id}\` doesn't exist.`)
                    ]
                });        

                return;
            }

            global.db.get("DELETE FROM threads WHERE id = ?", [data.id], async (err) => {
                global.db.get("DELETE FROM replies WHERE thread_id = ?", [data.id], async (err) => {
                    if (err) {
                        console.log(err);
                    }
    
                    const channel = global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());
    
                    if (typeof channel !== 'undefined') {
                        let obj = {
                            embeds: [
                                (new MessageEmbed())
                                    .setColor('#f14a60')
                                    .setDescription(`A thread has been deleted.`)
                                    .addField('ID', data.id + '')
                                    .addField('Deleted by', `${commands.msg.author.tag}`)
                                    .setFooter({text: 'Deleted'})
                                    .setTimestamp()
                            ]
                        };
    
                        
                        generate(obj);
    
                        await channel.send(obj);
                    }
    
                    let threadChannel = findThreadChannelCategory(data.channel_id);
    
                    // await threadChannel.send({
                    //     embeds: [
                    //         (new MessageEmbed())
                    //             .setColor('#f14a60')
                    //             .setDescription(`This thread has been closed.`)
                    //             .addField('ID', data.id + '')
                    //             .setFooter({text: 'Closed'})
                    //             .setTimestamp()
                    //     ]
                    // });
    
                    const user = client.users.cache.get(data.user_id);
    
                    if (typeof user === 'undefined' && data.status === 1) {
                        await user?.send({
                            embeds: [
                                (new MessageEmbed())
                                    .setColor('#f14a60')
                                    .setTitle('Thread Closed')
                                    .setDescription(`Your thread has been closed.\nIf you need further help, feel free to DM this bot again!`)
                                    .setFooter({text: 'Closed'})
                                    .setTimestamp()
                            ]
                        });
                    }
    
                    await commands.msg.reply({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#5cb85c')
                                .setDescription(`The thread has been deleted.`)
                                .addField('ID', data.id + '')
                                .setFooter({text: 'Deleted'})
                                .setTimestamp()
                        ]
                    });
    
                    await threadChannel.delete();
                });
            });
        });
};