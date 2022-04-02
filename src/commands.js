const fs = require('fs');
const path = require('path');

module.exports = {
    prefix: "$",
    msg: null,
    commands: {},
    commandNames: [],
    argv: [],
    args: [],
    commandName: "",
    commandsDirectory: path.join(__dirname, 'commands'),
    isValid() {
        return this.msg.content.startsWith(this.prefix);
    },
    init() {        
        fs.readdir(this.commandsDirectory, (err, files) => {
            if (err) {
                return console.log('Unable to scan commands directory: ' + err);
            } 

            this.commandNames = files.map(file => file.replace('\.js', ''));
            
            for (let index in files) {
                this.commands[this.commandNames[index]] = require(path.resolve(this.commandsDirectory, files[index]));
            }
        });
    },
    setMessage(msg) {
        this.msg = msg;
        this.argv = msg.content.split(' ');
        this.args = [...this.argv];
        this.commandName = this.args.shift().replace(this.prefix, '');
    },
    exists() {
        return this.commandNames.indexOf(this.commandName) !== -1;
    },
    async execute() {
        return await this.commands[this.commandName](this);
    }
};