module.exports = {
    version: '2.0.0-beta1',
    support: 'rakinar2@onesoftnet.ml',
    data: [
        {
            name: 'about',
            description: 'Shows information about the bot.',
            usage: "%%about",
            examples: "%%about"
        },
        {
            name: 'close',
            description: 'Closes a thread. Passing `-d` will delete the thread channel.',
            usage: "%%close <ThreadID> [-d]",
            examples: "%%close 78\n%%close 80 -d"
        },
        {
            name: 'cmd-notfound-warn',
            description: 'Toggle (Enable/disable) command not found warning.',
            usage: "%%cmd-notfound-warn",
            examples: "%%cmd-notfound-warn"
        },
        {
            name: 'control',
            description: 'Set a specific control panel channel. All commands will be rejected outside of that channel. To revert back to global, use `-` at the place of `ChannelID`.',
            usage: "%%control <ChannelID|->",
            examples: "%%control 73953474294379\n%%control -"
        },
        {
            name: 'debug',
            description: 'Toggle debug mode. If enabled, some debug info will be sent when running commands. When enabled, unauthorized users will see a warning if they run some command. Also, running commands outside of that channel will cause a warning. Disabling this mode suppresses all warnings.',
            usage: "%%debug",
            examples: "%%debug"
        },
        {
            name: 'editreply',
            description: "Send a new edited version of a reply to a specific thread author. Note that this command sends a new message, it doesn't edit the old one!",
            usage: "%%editreply <ReplyID> <...Message>",
            examples: "%%editreply 23 This is an edited message"
        },
        {
            name: 'help',
            description: "Show this help and exit.",
            usage: "%%help [Command]",
            examples: "%%help\n%%help close"
        },
        {
            name: 'history',
            description: "Show all the edit history of a reply.",
            usage: "%%history <ReplyID>",
            examples: "%%history"
        },
        {
            name: 'logging',
            description: 'Set a specific message logging channel. Each time when thread is created/closed or a message is created/edited, a log message is sent to this channel. To disable this, use `-` at the place of `ChannelID`.',
            usage: "%%logging <ChannelID|->",
            examples: "%%logging 7338472303171\n%%logging -"
        },
        {
            name: 'msg',
            description: 'View a reply message.',
            usage: "%%msg <ReplyID>",
            examples: "%%msg 45"
        },
        {
            name: 'ping',
            description: 'Set the role for message pings.',
            usage: "%%ping <RoleMention>",
            examples: "%%ping @Moderator"
        },
        {
            name: 'reply',
            description: 'Reply to a thread.',
            usage: "%%reply <ThreadID> <...Message>",
            examples: "%%reply 45 Hi, your request has been accepted."
        },
        {
            name: 'rt',
            description: 'Reply to a thread, inside a thread channel. This command won\'t work outside of a thread channel.',
            usage: "%%rt <...Message>",
            examples: "%%rt Hi, your request has been accepted."
        },
        {
            name: 'set-prefix',
            description: 'Set the bot prefix.',
            usage: "%%set-prefix <NewPrefix>",
            examples: "%%set-prefix -"
        },
        {
            name: 'setgroup',
            description: 'Set the channel category for threads.',
            usage: "%%setgroup <ChannelID>",
            examples: "%%setgroup 387654398524824"
        },
        {
            name: 'setrole',
            description: 'Set the authorized role for running commands. Users having this role can only run commands. You can give a mention or role ID as the argument. To allow globally, use `-` in the place of `<RoleID|MentionRole>`.',
            usage: "%%setrole <RoleID|MentionRole|->",
            examples: "%%setrole 387654398524824\n%%setrole @Moderators\n%%setrole -"
        },
        {
            name: 'setup',
            description: 'Setup the bot. You should only run this command once.',
            usage: "%%setup",
            examples: "%%setup"
        },
        {
            name: 'thread',
            description: 'View a/all thread(s). If `-s` or `--short` is specified, latest 20 open threads will be listed in short. If `ThreadID` is not given, then the latest open thread will be shown.',
            usage: "%%thread [ThreadID] [-s|--short]",
            examples: "%%thread 23\n%%thread -s\n%%thread"
        }
    ],
    findByName(name) {
        for (let cmd of this.data) {
            if (cmd.name === name)
                return cmd;
        }

        return null;
    }
};