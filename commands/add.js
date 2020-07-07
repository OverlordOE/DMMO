module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	category: 'debug',
	args: true,
	usage: '<money> <target>',

	cooldown: 0,

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const amount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const target = message.mentions.users.first() || message.author;

		if (args[0] == 'all') {
			profile.map((user) => profile.addMoney(user.user_id, args[1]));
			return message.channel.send(`Added **${amount}** to every available user`);
		}
		if (args[0] == 'item') {
			try {
				const char = await profile.getItem(args[1]);
				profile.addItem(target.id, char, args[2]);
			} catch (e) {
				return logger.error(e.stack);
			}
			return message.channel.send(`Added **${args[1]}** to ${target}`);
		}
		if (!amount || isNaN(amount)) return message.channel.send(`Sorry *${message.author}*, that's an invalid amount.`);

		profile.addMoney(target.id, amount);
		const balance = await profile.getBalance(target.id);

		if (amount <= 0) return message.channel.send(`Successfully removed **${amount * -1}💰** from *${target}*. Their current balance is **${balance}💰**`);
		return message.channel.send(`Successfully added **${amount}💰** to *${target}*. Their current balance is** ${balance}💰**`);

	},
};