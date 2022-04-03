const { MessageEmbed, MessageActionRow, ButtonInteraction, MessageButton } = require('discord.js');
const widgetManager = require('../widgetManager');

module.exports = async (commands) => {
    let id = typeof commands.args[0] === 'undefined' ? undefined : commands.args[0];

    let embed = (new MessageEmbed())
                .setColor('#007bff')
                .setDescription("The latest 20 open threads are listed in short here.");

    global.db.serialize(() => {
       if (commands.hasArg("--short") || commands.hasArg("-s")) {
            global.db.all("SELECT * FROM threads WHERE status = 1 ORDER BY id DESC LIMIT 0, 20", (err, rows) => {
                if (err) {
                    console.log("Error: " + err);
                }

                rows.forEach(row => {
                    embed.addField("ID: " + row.id, `User: ${row.user}`);
                });

                if (rows.length < 1) {
                    embed.setDescription("No open threads.");
                }
                
                commands.msg.reply({
                    embeds: [
                        embed
                    ]
                });
            });
       }
       else {
            widgetManager.createThreadMessageWidget(embed, id, async (e, dbrow) => {
                if (e === null) {
                    global.tmp.data.next = 0;
                }

                await commands.msg.reply({
                    embeds: [e === null ? (
                        new MessageEmbed()
                        .setDescription("Thread not found.")
                        .setColor("#f14a60")
                    ) : e],
                });
            });
       }
    });
};