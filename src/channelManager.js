const commands = require("./commands");

module.exports = {
    createThread(msg) {
        let name = this.createChannelName(msg);

        return client.guilds.cache.find(g => g.id === global.config.props.guild_id).channels.create(name, { 
            type: 'GUILD_TEXT',
            parent: client.guilds.cache.find(g => g.id === global.config.props.guild_id).channels.cache.find(c => c.id === global.config.props.channel_category)
        });
    },
    findThreadChannelCategory(id) {
        if (id === undefined)
            id = global.config.props.channel_category;

        return commands.msg.guild.channels.cache.find(c => c.id === id);
    },
    findThreadChannelCategoryInDM(id) {
        if (id === undefined)
            id = global.config.props.channel_category;

        return client.guilds.cache.find(g => g.id === global.config.props.guild_id).channels.cache.find(c => c.id === id);
    },
    createChannelName(msg) {
        return msg.author.username + '-' + msg.author.discriminator;
    }
};