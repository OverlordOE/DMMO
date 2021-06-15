const Discord = require('discord.js');
module.exports = {
	name: 'Buy',
	summary: 'Buy an item from the shop',
	description: 'With this you can buy an item from the shop.',
	category: 'economy',
	aliases: ['get'],
	args: true,
	usage: '<item> <amount>',
	example: 'chest 2',

	async execute(message, args, msgUser, msgGuild, client) {
		let amount = 1;
		let temp = '';

		const embed = new Discord.MessageEmbed()
			.setTitle('Project Neia Shop')
			.setColor('#f3ab16')
			.setThumbnail(message.author.displayAvatarURL());

		const sentMessage = await message.channel.send(embed);

		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) amount = parseInt(args[i]);

			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		if (amount < 1) amount = 1;

		const item = client.util.getItem(temp);
		if (item.buyable) buyItem(amount);

		else if (item) return sentMessage.edit(embed.setDescription('You can\'t buy this item.').setColor('#fc0303'));
		else if (temp) return sentMessage.edit(embed.setDescription(`__${temp}__ is not a valid item.`).setColor('#fc0303'));
		else return sentMessage.edit(embed.setDescription('You didn\'t specify the item you want to use.').setColor('#fc0303'));

		function buyItem(buyAmount) {
			let balance = msgUser.balance;
			const cost = buyAmount * item.value;
			if (cost > balance) return sentMessage.edit(embed.setDescription(`
					__**ITEM(S) NOT BOUGHT!**__
					You currently have ${client.util.formatNumber(balance)}💰 but __${client.util.formatNumber(buyAmount)}__ ${item.emoji}${item.name}(s) costs ${client.util.formatNumber(cost)}💰!
					You need ${client.util.formatNumber(cost - balance)}💰 more.
					`).setColor('#fc0303'));

			client.characterCommands.addItem(msgUser, item, buyAmount);
			balance = client.characterCommands.addBalance(msgUser, -cost);

			sentMessage.edit(embed.setDescription(`You've bought: __${client.util.formatNumber(buyAmount)}__ ${item.emoji}__${item.name}(s)__.\n\nCurrent balance is ${client.util.formatNumber(balance)}💰.`).setColor('#00fc43'));

		}
	},
};