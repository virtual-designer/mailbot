const { MessageEmbed } = require("discord.js");

module.exports = {
    async handle(commands, oldMsg, newMsg) {
        await global.db.serialize(async () => {
            global.db.get("SELECT * FROM replies WHERE msg_id = ?", [oldMsg.id], async (err, data) => {
                if (data === undefined) {
                    return;
                }
                

                global.db.get("UPDATE replies SET content = ?, msg_id = ? WHERE id = ?", [newMsg.content, newMsg.id, data.id], async (err) => {
                    db.get("INSERT INTO history(reply_id, content, user, user_id, date) VALUES(?, ?, ?, ?, ?)", [data.id, oldMsg.content, oldMsg.author.tag, oldMsg.author.id, (new Date).toISOString()], async (err) => {
                        if (err) {
                            console.log(err);
                        }
                        
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

                            await channel.send({
                                embeds: [
                                    e
                                ]
                            });
                        }

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
    }
};