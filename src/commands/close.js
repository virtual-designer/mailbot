const { MessageEmbed } = require('discord.js');
const { findThreadChannelCategory } = require('../channelManager');
const { generate } = require('../log');

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

                const channel = global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                if (typeof channel !== 'undefined') {
                    let obj = {
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#f14a60')
                                .setDescription(`A thread has been closed.`)
                                .addField('ID', data.id + '')
                                .addField('Closed by', `<@${commands.msg.author.id}>`)
                                .setFooter({text: 'Closed'})
                                .setTimestamp()
                        ]
                    };

                    
                    generate(obj);

                    await channel.send(obj);
                }
                
                if (typeof commands.args[1] !== 'undefined' && commands.args[1] === '-d') {
                    let threadChannel = findThreadChannelCategory(data.channel_id);
                    await threadChannel.delete();
                }

                const user = client.users.cache.get(data.user_id);

                if (typeof user !== 'undefined') {
                    await user.send({
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
                            .setDescription(`The thread has been closed.`)
                            .addField('ID', data.id + '')
                            .setFooter({text: 'Closed'})
                            .setTimestamp()
                    ]
                });
            });
        });
    });    
};