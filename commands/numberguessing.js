const Discord = require('discord.js');
module.exports = {
	name: 'NumberGuessing',
	summary: 'Guess the right number and win',
	description: 'Guess the right number out of 5 and win. Has a high payout rate.',
	category: 'gambling',
	aliases: ['number', 'numbers', 'guess'],
	args: true,
	usage: '<gamble amount>',
	example: '100',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		let gambleAmount = 0;
		const payoutRate = 5;

		const embed = new Discord.MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));


		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) gambleAmount = parseInt(args[i]);
			else if (args[i] == 'all') gambleAmount = Math.floor(msgUser.balance);
		}

		if (gambleAmount < 1) gambleAmount = 1;

		if (!gambleAmount || isNaN(gambleAmount)) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, that's an **invalid amount.**`));
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));
		if (gambleAmount <= 0) return message.channel.send(embed.setDescription(`Please enter an amount **greater than zero**, *${message.author}*.`));

		client.userCommands.addBalance(msgUser, -gambleAmount, true);

		const filter = (reaction, user) => {
			return [client.emojiCharacters[1], client.emojiCharacters[2], client.emojiCharacters[3], client.emojiCharacters[4], client.emojiCharacters[5]]
				.includes(reaction.emoji.name) && user.id === msgUser.user_id;
		};

		const answer = Math.floor((Math.random() * 5) + 1);
		const winAmount = payoutRate * gambleAmount;

		const sentMessage = await message.channel.send(embed.setDescription(`You have **bet** ${client.util.formatNumber(gambleAmount)}💰.\n**Guess the __number__ between __1 and 5__.**`).setTitle('Number Guessing'));
		for (let i = 1; i < 6; i++) sentMessage.react(client.emojiCharacters[i]);

		sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();

				if (reaction.emoji.name === client.emojiCharacters[answer]) {
					const balance = client.userCommands.addBalance(msgUser, winAmount, true);
					embed.setColor('#00fc43');
					sentMessage.edit(embed.setDescription(`__You have chosen__ ${reaction.emoji.name}\nThe **correct answer** was ${client.emojiCharacters[answer]}.\n
					__**You win**__ ${client.util.formatNumber(winAmount)}💰.\nYour current balance is ${client.util.formatNumber(balance)}💰`));
				}
				else {
					embed.setColor('#fc0303');
					sentMessage.edit(embed.setDescription(`__You have chosen__ ${reaction.emoji.name}\nThe **correct answer** was ${client.emojiCharacters[answer]}.\n
					__**You lost**__ ${client.util.formatNumber(gambleAmount)}💰.\nYour current balance is ${client.util.formatNumber(msgUser.balance)}💰`));
				}
				return sentMessage.reactions.removeAll();
			});


	},
};

