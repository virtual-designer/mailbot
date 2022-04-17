const { MessageEmbed } = require('discord.js');
const { findThreadChannelCategory } = require('../channelManager');
const { msg } = require('../commands');
const { generate } = require('../log');

module.exports = async (commands) => {
    let q = " WHERE status = 1";

    if (commands.args.indexOf('-a') !== -1) {
        q = '';
    }
    else if (commands.args.indexOf('-c') !== -1) {
        q = ' WHERE status = 0';
    }

    global.db.serialize(async () => {
        global.db.all("SELECT * FROM threads" + q, async (err, data) => {
            if (err) {
                console.log(err);
            }

            if (data === undefined || data.length < 1) {
                await commands.msg.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('#007bff')
                        .setDescription("No threads found")
                    ]
                });

                return;
            }

            console.log(q);

            await global.db.get('DELETE FROM threads' + q, async (err) => {
                console.log('inside', err);

                await data.forEach(async (thread) => {
                    await global.db.get('DELETE FROM replies WHERE thread_id = ?', [thread.id], async () => {
                        if (thread.status === 1) {
                            const user = await client.users.cache.get(thread.user_id);

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
                        }
                        
                        let threadChannel = await commands.msg.guild.channels.cache.find(t => t.id === thread.channel_id);
                        await threadChannel?.delete();
                    });
                });

                const channel = await global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                if (typeof channel !== 'undefined') {
                    let obj = {
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#f14a60')
                                .setDescription(`All ${q === '' ? '' : (q === ' WHERE status = 1' ? 'open ' : 'closed ')}threads have been deleted.`)
                                .addField('Closed by', `${commands.msg.author.tag}`)
                                .setFooter({text: 'Closed'})
                                .setTimestamp()
                        ]
                    };

                    
                    await generate(obj);

                    await channel.send(obj);
                }

                try {
                    commands.msg.reply({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#007bff')
                                .setDescription(`All ${q === '' ? '' : 'open '}threads have been closed.`)
                        ]
                    });
                }
                catch(e) {
                    console.log(e);
                }
            });
        });
    });    
};