const disallowedCommandsGlobal = [];
const disallowedCommands = [];

function isAllowedInChannel(cmd) {
    return disallowedCommandsGlobal.indexOf(cmd) === -1 && (global.config.props.control_channel === '-' || global.commands.channel === global.config.props.control_channel);
}

function isAllowed(cmd) {
    return disallowedCommands.indexOf(cmd) === -1;
}

module.exports = {
    disallowedCommandsGlobal,
    disallowedCommands,
    isAllowed,
    isAllowedInChannel,
};