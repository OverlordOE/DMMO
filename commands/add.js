module.exports = {
	name: 'add',
	description: 'Adds money too the mentioned user.',
	category: 'debug',
	args: true,
	usage: '<money> <target>',

	cooldown: 0,

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {
		const amount = args.find(arg => !/<@!?\d+>/g.test(arg));
		const target = message.mentions.users.first() || message.author;


		if (args[0] == 'all') {
			character.map((user) => character.addMoney(user.user_id, args[1]));
			return message.channel.send(`Added **${amount}** to every available user`);
		}
		else if (args[0] == 'item') {
			const item = await character.getItem(args[1]);
			character.addItem(target.id, item, args[2]);
			return message.channel.send(`Added **${args[2]}** __${args[1]}__ to ${target}`);
		}
		else if (args[0] == 'exp') {
			await character.addExp(target.id, args[1], message);
			return message.channel.send(`Added **${args[1]}** EXP to ${target}`);
		}
		else if (args[0] == 'skill') {
			const item = await character.getSkill(args[1]);
			character.addSkill(target.id, item);
			return message.channel.send(`Added **${args[1]}** to ${target}`);
		}
		else if (args[0] == 'skill') {
			const item = await character.getSkill(args[1]);
			character.addSkill(target.id, item);
			return message.channel.send(`Added **${args[1]}** to ${target}`);
		}


		if (!amount || isNaN(amount)) return message.channel.send(`Sorry *${message.author}*, that's an invalid amount.`);

		character.addMoney(target.id, amount);
		const balance = await character.getBalance(target.id);

		if (amount <= 0) return message.channel.send(`Successfully removed **${amount * -1}💰** from *${target}*. Their current balance is **${balance}💰**`);
		return message.channel.send(`Successfully added **${amount}💰** to *${target}*. Their current balance is** ${balance}💰**`);

	},
};