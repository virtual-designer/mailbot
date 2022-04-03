const { MessageEmbed } = require("discord.js");

module.exports = {
    async handle(commands, oldMsg, newMsg) {
        await global.db.serialize(async () => {
            global.db.get("SELECT * FROM replies WHERE msg_id = ?", [oldMsg.id], async (err, data) => {
                if (data === undefined) {
                    return;
                }
                

                global.db.get("UPDATE replies SET content = ?, msg_id = ? WHERE id = ?", [newMsg.content, newMsg.id, data.id], async (err) => {
                    await newMsg.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor('#007bff')
                            .setDescription("Your message was successfully updated.")
                            .setTimestamp()
                            .setFooter({text: "Updated"})
                        ]
                    });
                });
            }); 
        });
    }
};