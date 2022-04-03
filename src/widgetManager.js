
module.exports = {
    createThreadMessageWidget(embed, id, callback) {
        global.db.serialize(() => {
            global.db.get(typeof id !== 'undefined' ? "SELECT * FROM threads WHERE status = 1 AND id = ? ORDER BY id DESC LIMIT 0, 1" : "SELECT * FROM threads WHERE status = 1 ORDER BY id DESC LIMIT 0, 1", typeof id !== 'undefined' ? [id] : [], (err, dbrow) => {
                if (err) {
                    console.log("Error: " + err);
                }

                console.log(id + " TH");

                if (dbrow === undefined)
                    return callback(null);
            
                global.db.get("SELECT * FROM replies WHERE thread_id = ? ORDER BY id DESC LIMIT 0, 1", [dbrow.id], (err, dbrow2) => {
                    if (err) {
                        console.log("Error: " + err);
                    }
            
                    embed.setAuthor({ name: dbrow2.user });
                    embed.setDescription(dbrow2.content);
                    embed.addField("Message author", dbrow2.user);
                    embed.addField("Thread author", dbrow.user);
                    embed.addField("Sent at", new Date(dbrow2.date).toUTCString());
                    embed.addField("Status", dbrow.status === 1 ? "Open" : "Closed");
                  //  embed.addField("Updated at", new Date(dbrow2.date)); TODO
                    embed.addField("ID", dbrow.id + "");
                    embed.addField("Thread created at", new Date(dbrow.date).toUTCString());
                    embed.setTimestamp(new Date(dbrow2.date));
            
                    callback(embed, dbrow, dbrow2);
                });
            });
        });
    },
    createAllThreadMessageWidget(embed, id, callback) {
        global.db.serialize(() => {
            global.db.get(typeof id !== 'undefined' ? "SELECT * FROM threads WHERE id = ? ORDER BY id DESC LIMIT 0, 1" : "SELECT * FROM threads ORDER BY id DESC LIMIT 0, 1", typeof id !== 'undefined' ? [id] : [], (err, dbrow) => {
                if (err) {
                    console.log("Error: " + err);
                }

                console.log(id + " TH");

                if (dbrow === undefined)
                    return callback(null);
            
                global.db.get("SELECT * FROM replies WHERE thread_id = ? ORDER BY id DESC LIMIT 0, 1", [dbrow.id], (err, dbrow2) => {
                    if (err) {
                        console.log("Error: " + err);
                    }
            
                    embed.setAuthor({ name: dbrow2.user });
                    embed.setDescription(dbrow2.content);
                    embed.addField("Message author", dbrow2.user);
                    embed.addField("Thread author", dbrow.user);
                    embed.addField("ID", dbrow.id + "");
                    embed.addField("Status", dbrow.status === 1 ? "Open" : "Closed");
                    embed.addField("Sent at", new Date(dbrow2.date).toUTCString());
                  //  embed.addField("Updated at", new Date(dbrow2.date)); TODO
                    embed.addField("Thread created at", new Date(dbrow.date).toUTCString());
                    embed.setTimestamp(new Date(dbrow2.date));
            
                    callback(embed, dbrow, dbrow2);
                });
            });
        });
    }
};