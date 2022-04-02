const fs = require('fs');
const path = require('path');

module.exports = {
    props: {},
    filename: "config.json",
    filepath: "",
    load() {
        this.filepath = path.resolve(__dirname, "..", "config", this.filename);
        this.props = JSON.parse(fs.readFileSync(this.filepath, {"encoding": "utf-8"}));
    },
    update() {
         fs.writeFileSync(this.filepath, JSON.stringify(this.props));
    },
    get(key, _default) {
        if (typeof this.props[key] === 'undefined')
            return (typeof _default === 'undefined' ? undefined : _default);
        
        return this.props[key];
    }
};