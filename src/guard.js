const disallowedCommandsGlobal = [];
const disallowedCommands = [];

function isAllowedInChannel(cmd) {
    return disallowedCommandsGlobal.indexOf(cmd) === -1 && (global.config.props.control_channel === '-' || global.commands.channel === global.config.props.control_channel || global.commands.msg.channel?.parent?.id === global.config.props.channel_category);
}

function isAllowed(cmd) {
    return disallowedCommands.indexOf(cmd) === -1 && (global.config.props.role === '-' || global.commands.msg.member.roles.cache.has(global.config.props.role));
}

module.exports = {
    disallowedCommandsGlobal,
    disallowedCommands,
    isAllowed,
    isAllowedInChannel,
};