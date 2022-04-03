const { MessageEmbed } = require('discord.js');

module.exports = {
    msg: null,
    thread: null,
    newThread: false,
    init(msg) {
        this.msg = msg;
    },
    async handle() {
        global.db.serialize(async () => {
            this.newThread = false;
            
            let date = new Date();
            
            global.db.get("SELECT * FROM threads WHERE user_id = ? AND status = 1", [this.msg.author.id], (err, row) => {
                if (err) {
                    console.log('Query failed: dm.js: ' + err);
                }

                console.log(row);

                if (typeof row === 'undefined') {
                    global.db.get("INSERT INTO threads(user, user_id, date) VALUES(?, ?, ?)", [this.msg.author.tag, this.msg.author.id, date.toISOString()], err => {
                        if (err) {
                            console.log('Query failed: dm.js: ' + err);
                        }

                        this.newThread = true;
                    });

                    console.log('inside');
                }

                global.db.get("SELECT * FROM threads ORDER BY id DESC LIMIT 0, 1", (err, row) => {
                    if (err) {
                        console.log('Query failed: dm.js: ' + err);
                    }
    
                    this.thread = row;
                });
            });

            var tm = setInterval(() => {
                if (this.thread != null) {
                    clearInterval(tm);
                    global.db.get("INSERT INTO replies(content, user, user_id, date, thread_id) VALUES(?, ?, ?, ?, ?)", [this.msg.content, this.msg.author.tag, this.msg.author.id, date.toISOString(), this.thread.id], err => {
                        if (err) {
                            console.log('Query failed: dm.js');
                        }
                        else {
                            this.msg.reply({
                                embeds: [
                                    (new MessageEmbed())
                                    .setColor('#007bff')
                                    .setTitle(this.newThread ? "New thread created" : "Message sent")
                                    .setDescription((this.newThread ? "A new thread was created with your message!" : "Your message was sent successfully!") + " One of the staff group members will get you in touch soon!")
                                    .setTimestamp()
                                    .setFooter({
                                        text: this.newThread ? 'Created' : 'Sent',
                                    })
                                ]
                            });

                            global.db.get('SELECT * FROM threads ORDER BY id DESC LIMIT 0, 1', (err, data) => {
                                const channel = global.client.channels.cache.find(ch => ch.id === global.config.props.logging_channel.trim());

                                if (typeof channel !== 'undefined') {
                                    let e = (new MessageEmbed())
                                            .setColor('#007bff')
                                            .setTitle(this.newThread ? "New thread" : "Incoming message")
                                            .setDescription((this.newThread ? "A new thread was created." : "") + "\n\n" + this.msg.content)
                                            .addField("User", this.msg.author.tag)
                                            .addField("Thread ID", data.id + "")
                                            .setTimestamp()
                                            .setFooter({
                                                text: this.newThread ? 'Created' : 'Sent',
                                            });

                                    channel.send({
                                        embeds: [
                                            e
                                        ]
                                    });
                            }
                            });
                        }

                        this.thread = null;
                    });
                }
            }, 700);
        });
    }
};

/*
 * client.users.fetch('487904509670337509', false).then((user) => {
 user.send('hello world');
});
 */