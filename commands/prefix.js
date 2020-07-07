module.exports = {
	name: 'prefix',
	summary: 'Change the prefix of the client for this server',
	description: 'Change the prefix of the client for this server.',
	category: 'admin',
	args: false,
	usage: '',

	cooldown: 3,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const id = message.guild.id;

		if (args[0]) {
			const newPrefix = args[0];
			guildProfile.setPrefix(id, newPrefix);
			return message.channel.send(`Changed the prefix for this server too: ${newPrefix}`);
		}
		const prefix = await guildProfile.getPrefix(id);
		return message.channel.send(`The prefix for this server is: ${prefix}`);
	},
};