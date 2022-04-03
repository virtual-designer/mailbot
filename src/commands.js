const fs = require('fs');
const path = require('path');

module.exports = {
    prefix: global.config.props.prefix,
    msg: null,
    commands: {},
    commandNames: [],
    argv: [],
    args: [],
    commandName: "",
    commandsDirectory: path.join(__dirname, 'commands'),
    interactionsDirectory: path.join(__dirname, 'interactions'),
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
        this.argv = msg.content.split(' ').filter(c => c.trim() != '');
        this.args = [...this.argv];
        this.commandName = this.args.shift().replace(this.prefix, '');
    },
    setInteraction(i) {
        this.interaction = i;
    },
    exists() {
        return this.commandNames.indexOf(this.commandName) !== -1;
    },
    async execute() {
        return await this.commands[this.commandName](this);
    },
    hasArg(arg) {
        return this.args.indexOf(arg) !== -1;
    }
};