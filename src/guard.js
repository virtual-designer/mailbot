const disallowedCommandsGlobal = [];

function isAllowed(cmd) {
    return disallowedCommandsGlobal.indexOf(cmd) === -1 && (global.config.props.control_channel === '-' || global.commands.channel === global.config.props.control_channel);
}

module.exports = {
    disallowedCommandsGlobal,
    isAllowed
};