module.exports.run = (client, message, args) => {
    let commandsList = client.Commands.array().filter(object => !object.info.get("unlisted"));

};

module.exports.info = {
    command: "",
    usage: "help <pageNumber: integer>\nshows commands on the given page number, must be a valid page\nhelp <commandName: string>\ngives help over a single command/alias\nhelp\ntells you how many pages there is",
    description: "Helps you use the bot"
};