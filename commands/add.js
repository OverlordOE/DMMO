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
		else if (args[0] == 'item') {
			const item = await profile.getItem(args[1]);
			profile.addItem(target.id, item, args[2]);
			return message.channel.send(`Added **${args[1]}** to ${target}`);
		}
		else if (args[0] == 'exp') {
			const levelinfo = await profile.addExp(target.id, args[1]);
			if (levelinfo.levelup) message.channel.send(`${target} has leveled up to level **${levelinfo.level}**`);
			return message.channel.send(`Added **${args[1]}** EXP to ${target}`);
		}


		if (!amount || isNaN(amount)) return message.channel.send(`Sorry *${message.author}*, that's an invalid amount.`);

		profile.addMoney(target.id, amount);
		const balance = await profile.getBalance(target.id);

		if (amount <= 0) return message.channel.send(`Successfully removed **${amount * -1}💰** from *${target}*. Their current balance is **${balance}💰**`);
		return message.channel.send(`Successfully added **${amount}💰** to *${target}*. Their current balance is** ${balance}💰**`);

	},
};