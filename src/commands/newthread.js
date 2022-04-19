const { MessageEmbed, MessageActionRow, ButtonInteraction, MessageButton } = require('discord.js');
const channelManager = require('../channelManager');
const widgetManager = require('../widgetManager');

module.exports = async (commands) => {
    if (commands.args[0] === undefined) {
        await commands.msg.reply({
            embeds: [
                (new MessageEmbed())
                .setColor('#f14a60')
                .setDescription(`:x:\tThe command \`${commands.commandName}\` requires at least one argument.`)
            ]
        });

        return;
    }
    
    let id = commands.msg.mentions?.members?.first();
    
    if (typeof id !== 'object' || id === null) {
        try {
            id = await commands.msg.guild.members.fetch(commands.args[0]);
            console.log(id);
        }
        catch (e) {
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

    await global.db.serialize(async () => {
        if (typeof id.user === 'undefined') {
            id.user = id;
        }

        id.tag = id.user.username + '#' + id.user.discriminator;
        let threadChannel = await channelManager.createThread({
            author: id.user
        });

        await global.db.get("INSERT INTO threads(user, user_id, date, channel_id) VALUES(?, ?, ?, ?)", [id.user.tag, id.user.id, (new Date()).toISOString(), threadChannel.id], async (err) => {
            if (err) {
                console.log('Query failed: dm.js: ' + err);
            }

            await db.get('SELECT * FROM threads WHERE status = 1 AND channel_id = ? ORDER BY id DESC LIMIT 0, 1', [threadChannel.id], async (err, data) => {
                const user = client.users.cache.get(data.user_id);

                if (typeof user !== 'undefined') {
                    await user.send({
                        embeds: [
                            (new MessageEmbed())
                                .setColor('#007bff')
                                .setDescription('New thread created')
                        ]
                    });
                }

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

                await commands.msg.reply({
                    embeds: [
                        (new MessageEmbed())
                        .setColor('#007bff')
                        .setDescription('New thread created. Go to <#' + threadChannel.id + '> to start conversation with ' + id.user.tag)
                        .addField('Thread ID', data.id + '')
                    ]
                });
            });
        });
    });
};