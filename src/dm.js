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
            let date = new Date();
            
            global.db.get("SELECT * FROM threads WHERE user_id = ?", [this.msg.author.id], (err, row) => {
                if (err) {
                    console.log('Query failed: dm.js: ' + err);
                }

                if (typeof row === 'undefined') {
                    global.db.get("INSERT INTO threads(user, user_id, date) VALUES(?, ?, ?)", [this.msg.author.tag, this.msg.author.id, date.toISOString()], err => {
                        if (err) {
                            console.log('Query failed: dm.js: ' + err);
                        }

                        this.newThread = true;
                    });
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
                        }
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