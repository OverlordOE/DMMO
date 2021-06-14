const Discord = require('discord.js');
const Topgg = require('@top-gg/sdk');
const topApi = new Topgg.Api(process.env.DBL_TOKEN);
module.exports = {
	name: 'vote',
	summary: 'vote for the client to get an extra daily',
	description: 'vote for the client to get a reward.',
	category: 'money',
	aliases: ['v'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		const vote = client.characterCommands.getVote(msgUser);
		let chest;

		const luck = Math.floor(Math.random() * 5);
		if (luck == 0) chest = 'Epic chest';
		if (luck == 1) chest = 'Mystery chest';
		else chest = 'Rare chest';
		chest = client.util.getItem(chest);


		const embed = new Discord.MessageEmbed()
			.setTitle('Vote Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(client.characterCommands.getColour(msgUser))
			.setFooter('You can vote every 12 hours.', client.user.displayAvatarURL());


		topApi.hasVoted(message.author.id).then(async voted => {
			if (voted) {
				if (vote === true) {
					if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
						.setImage(`attachment://${chest.picture}`);

					const income = await client.characterCommands.calculateIncome(msgUser);
					client.characterCommands.addBalance(msgUser, income.daily);
					client.characterCommands.addItem(msgUser, chest);
					client.characterCommands.setVote(msgUser);

					const balance = client.util.formatNumber(msgUser.balance);
					message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your vote 🎁 and ${client.util.formatNumber(income.daily)}💰 from your collectables.
					Come back in 12 hours for more!\n\nYour current balance is ${balance}💰`));
				}
				else return message.channel.send(embed.setDescription(`You have already voted in the last 12 hours.\nNext vote available at __${vote}__`));

			}
			else {
				client.characterCommands.setVote(message.author.id, false);
				return message.channel.send(embed.setDescription(`Vote for DMMO and get up to **2 extra rewards** a day.
				To get the daily's just vote [here](https://top.gg/bot/684458276129079320/vote) and then use this command again (this usually takes about 2-3 mins to update), you can do this every 12 hours!`));
			}
		});


	},
};