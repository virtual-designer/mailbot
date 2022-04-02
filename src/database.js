const sqlite3 = require('sqlite3').verbose();
const path = require('path');

module.exports = {
    dbname: "../database.db",
    db: null,
    init() {
        global.db = this.db = new sqlite3.Database(path.resolve(__dirname, this.dbname), sqlite3.OPEN_READWRITE, err => {
            if (err) {
                console.error(err.message);
            }
        
            console.log('Connected to the database.');
        }); 
    },
    close() {
        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
        
            console.log('Closed the database connection.');
        });
    }
};