module.exports = async (commands) => {
    await commands.msg.reply({
        content: "You typed: " + commands.msg.content
    });
};