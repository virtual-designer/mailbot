const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const { findThreadChannelCategory } = require('../channelManager');
const { generate } = require('../log');

const closeables = new Map();

async function close(id, data2, del) {
    //console.log(id);
    await global.db.get('SELECT * FROM threads WHERE status = 1 AND id = ? LIMIT 0, 1', [id], async (err, data) => {
        //console.log(data, id);

        if (data === undefined) {
            return;
        }

        await global.db.get("UPDATE threads SET status = 0 WHERE id = ?", [data.id], async (err) => {
            if (err) {
                console.log(err);
            }
    
            const channel = await global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());
    
            if (typeof channel !== 'undefined') {
                let obj = {
                    embeds: [
                        (new MessageEmbed())
                            .setColor('#f14a60')
                            .setDescription(`A thread has been closed.`)
                            .addField('ID', data.id + '')
                            .addField('Closed by', `${data2.author.tag}`)
                            .setFooter({text: 'Closed'})
                            .setTimestamp()
                    ]
                };
    
                
                await generate(obj);
    
                await channel.send(obj);
            }
    
            let threadChannel = await findThreadChannelCategory(data.channel_id);
    
            await threadChannel.send({
                embeds: [
                    (new MessageEmbed())
                        .setColor('#f14a60')
                        .setDescription(`This thread has been closed.`)
                        .addField('ID', data.id + '')
                        .setFooter({text: 'Closed'})
                        .setTimestamp()
                ]
            });
    
            const user = await client.users.cache.get(data.user_id);
    
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
            
            if (del) {
                await threadChannel.delete();
            }
        });
    });
}

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

    let timeout = null;

    if (commands.args[0] !== undefined) {
        timeout = Math.abs(ms(commands.args[0]));

        if (typeof timeout !== 'number') {
            await commands.msg.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('#f14a60')
                    .setDescription(':x:\tArgument #1 must be a valid time!')
                ]
            });

            return;
        }
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

        if (data.status === 0) {
            await commands.msg.reply({
                embeds: [
                    (new MessageEmbed())
                    .setColor('#f14a60')
                    .setDescription(`:x:\tThe thread with ID \`${data.id}\` is already closed.`)
                ]
            });        

            return;
        }

        if (typeof timeout === 'number') {
            console.log('inside');

            closeables.set(data.id, {
                id: data.id,
                time: new Date(new Date().getTime() + timeout),
                author: commands.msg.author,
                del: typeof commands.args[0] !== 'undefined' && commands.args.indexOf('-d') !== -1
            });

            console.log(closeables.entries());

            setTimeout(async () => {
                console.log('closing');
                let keys = [];

                await closeables.forEach(async (value, key) => {
                    if (value.time.getTime() <= (new Date()).getTime()) {
                        console.log(value.time.getTime());
                        await keys.push(key);
                        await close(value.id, value, value.del);
                    }
                });

                await keys.forEach(async key => {
                    await closeables.delete(key);
                });
            }, timeout);

            await commands.msg.reply({
                embeds: [
                    (new MessageEmbed())
                    .setColor('#007bff')
                    .setDescription(`:clock:\tThe thread with ID \`${data.id}\` will be closed after ${commands.args[0]}.`)
                ]
            });    

            return;
        }

        global.db.get("UPDATE threads SET status = 0 WHERE id = ?", [data.id], async (err) => {
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
                            .addField('Closed by', `${commands.msg.author.tag}`)
                            .setFooter({text: 'Closed'})
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

            
            if (typeof commands.args[0] !== 'undefined' && commands.args[0] === '-d') {
                await threadChannel.delete();
            }
        });
    });
};