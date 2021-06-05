const Discord = require('discord.js');
module.exports = {
	name: 'RockPaperScisscors',
	summary: 'Play a game of Rock, Paper, Scissors against Neia',
	description: 'Play a game of Rock, Paper, Scissors against Neia.',
	category: 'gambling',
	aliases: ['rps', 'rock'],
	args: true,
	usage: '<gamble amount>',
	example: '100',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		let gambleAmount = 0;
		const payoutRate = 1.8;

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
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));

		client.userCommands.addBalance(msgUser, -gambleAmount, true);

		const symbols = ['✊', '🧻', '✂️'];
		const filter = (reaction, user) => {
			return symbols.includes(reaction.emoji.name) && user.id === msgUser.user_id;
		};

		const botAnswer = Math.floor(Math.random() * symbols.length);
		const winAmount = payoutRate * gambleAmount;

		const sentMessage = await message.channel.send(embed.setDescription(`You have **bet** ${client.util.formatNumber(gambleAmount)}💰.\nChoose **__Rock__✊, __Paper__🧻 or __Scissors__✂️!**`).setTitle('Rock, Paper, Scissors'));
		for (let i = 0; i < symbols.length; i++) sentMessage.react(symbols[i]);


		sentMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();
				const userAnswer = symbols.indexOf(reaction.emoji.name);

				if (userAnswer === botAnswer) {
					const balance = client.userCommands.addBalance(msgUser, gambleAmount);
					sentMessage.edit(embed.setDescription(`**Neia** chooses ${symbols[botAnswer]}. __**It's a tie!**__\nYour balance is ${client.util.formatNumber(balance)}💰`));
				}
				else if (botAnswer - userAnswer === 1 || botAnswer - userAnswer === -2) {
					sentMessage.edit(embed.setDescription(`**Neia** chooses ${symbols[botAnswer]}. __**You lose!**__\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`).setColor('#fc0303'));
				}
				else if (userAnswer - botAnswer === 1 || userAnswer - botAnswer === -2) {
					const balance = client.userCommands.addBalance(msgUser, winAmount, true);
					sentMessage.edit(embed.setDescription(`**Neia** chooses ${symbols[botAnswer]}. __**You Win!**__\nYou won ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`).setColor('#00fc43'));
				}
				return sentMessage.reactions.removeAll();
			})
			.catch(() => sentMessage.reactions.removeAll());
	},
};

