module.exports = {
	name: 'prefix',
	summary: 'Change the prefix of the bot for this server',
	description: 'Change the prefix of the bot for this server.',
	category: 'admin',
	args: false,
	usage: '',

	async execute(message, args, msgUser, client, logger) {
		const id = message.guild.id;

		if (args[0]) {
			const newPrefix = args[0];
			client.guildCommands.setPrefix(id, newPrefix);
			return message.channel.send(`Changed the prefix for this server too: ${newPrefix}`);
		}
		const prefix = await client.guildCommands.getPrefix(id);
		return message.channel.send(`The prefix for this server is: ${prefix}`);
	},
};