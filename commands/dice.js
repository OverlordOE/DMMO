const Discord = require('discord.js');
module.exports = {
	name: 'dice',
	summary: 'Roll up to 100 of any sided die',
	description: 'Rolls dice and shows the total.\nThe first argument is the amount of sides you want the dice to have, the second argument is how many times to roll it(up to 100).',
	category: 'misc',
	aliases: ['roll'],
	args: true,
	usage: '<sides> <amount>',

	execute(message, args, msgUser, client, logger) {

		const embed = new Discord.MessageEmbed()
			.setColor(client.characterCommands.getColour(msgUser));

		const sides = args[0];
		let amount;
		if (args[1]) amount = args[1];
		else amount = 1;

		if (amount > 100 || isNaN(amount) || amount < 0) { return message.reply('maximum die amount is 100.'); }

		let total = 0;
		let result = '';


		const firstRoll = Math.floor((Math.random() * sides) + 1);
		total += firstRoll;
		if (firstRoll == sides || firstRoll == 1) result += ` + **${firstRoll}**`;
		else result += ` + ${firstRoll}`;

		for (let i = 1; i < amount; i++) {
			const roll = Math.floor((Math.random() * sides) + 1);
			if (roll == sides || roll == 1) result += ` + **${roll}**`;
			else result += ` + ${roll}`;
			total += roll;
		}

		message.channel.send(embed.setDescription(`You rolled a __D${sides}__ **${amount}** times, these are the results: \n${result}\n= __**${total}**__`));
	},
};