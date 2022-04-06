module.exports = {
    generate(obj) {
        if (global.config.props.ping_on_msg !== '-') {
            obj.content = `<@&${(global.client.guilds.cache.find(g => g.id === global.config.props.guild_id).roles.cache.find(r => r.id === global.config.props.ping_on_msg)).id}>`;
        }
    }
};