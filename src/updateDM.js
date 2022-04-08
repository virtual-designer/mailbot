const { MessageEmbed } = require("discord.js");
const channelManager = require("./channelManager");
const { db } = require("./database");
const { generate } = require("./log");

module.exports = {
    async handle(commands, oldMsg, newMsg) {
        await global.db.serialize(async () => {
            global.db.get("SELECT * FROM replies WHERE msg_id = ?", [oldMsg.id], async (err, data) => {
                if (data === undefined) {
                    return;
                }
                

                global.db.get("UPDATE replies SET content = ?, msg_id = ? WHERE id = ?", [newMsg.content, newMsg.id, data.id], async (err) => {
                    global.db.get("INSERT INTO history(reply_id, content, user, user_id, date) VALUES(?, ?, ?, ?, ?)", [data.id, oldMsg.content, oldMsg.author.tag, oldMsg.author.id, (new Date).toISOString()], async (err) => {
                        if (err) {
                            console.log(err);
                        }
                        
                        global.db.get("SELECT * FROM threads WHERE id = ?", [data.thread_id], async (err, data2) => {
                            const channel = global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                            if (typeof channel !== 'undefined') {
                                let e = (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setTitle("Message Updated")
                                    .setDescription(newMsg.content)
                                    .addField("User", newMsg.author.tag)
                                    .addField("Thread ID", data.thread_id + "")
                                    .addField("Message ID", data.id + "")
                                    .setTimestamp()
                                    .setFooter({
                                        text: "Updated"
                                    });

                                let obj = {
                                    embeds: [
                                        e
                                    ]
                                };

                                generate(obj);

                                await channel.send(obj, true);
                            }

                            let threadChannel = await channelManager.findThreadChannelCategoryInDM(data2.channel_id);

                            await threadChannel.send({
                                embeds: [
                                    (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setTitle("Message Updated")
                                    .setDescription(newMsg.content)
                                    .setAuthor({name: newMsg.author.tag})
                                    .setFooter({text: 'Updated'})
                                    .addField("Thread ID", data.thread_id + "")
                                    .addField("Message ID", data.id + "")
                                    .setTimestamp()
                                ]
                            });

                            await newMsg.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setColor('#007bff')
                                    .setTitle("Message Updated")
                                    .setDescription("Your message was successfully updated.")
                                    .setTimestamp()
                                    .setFooter({text: "Updated"})
                                ]
                            });
                        });
                    });
                });
            }); 
        });
    }
};