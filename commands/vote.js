const Discord = require('discord.js');
const DBL = require('dblapi.js');
const dblToken = process.env.DBL_TOKEN;
const dbl = new DBL(dblToken);
module.exports = {
	name: 'vote',
	summary: 'vote for the client to get an extra daily',
	description: 'vote for the client to get a reward.',
	category: 'money',
	aliases: ['v'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const vote = await profile.getVote(message.author.id);
		const embed = new Discord.MessageEmbed()
			.setTitle('Vote Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		dbl.hasVoted(message.author.id).then(async voted => {
			if (voted) {
				if (vote === false) {
					const reward = 20 + Math.floor(Math.random() * 20);
					profile.addMoney(message.author.id, reward);
					const balance = await profile.getBalance(message.author.id);
					profile.setVote(message.author.id, true);
					return message.channel.send(embed.setDescription(`Thank you for voting!!!\nYou got **${reward}💰** from your vote.\n\nCome back in 12 hours for more!\nYour current balance is **${balance}💰**`));
				}
				else return message.channel.send(embed.setDescription(`You have already voted in the last 12 hours.\nNext vote available at __${vote}__`));

			}
			else {
				profile.setVote(message.author.id, false);
				return message.channel.send(embed.setDescription('Vote for DMMO and get up to **2 extra daily\'s** a day.\nTo get the daily\'s just vote [here](https://top.gg/bot/684458276129079320/vote) and then use this command again (this usually takes about 2-3 mins to update), you can do this every 12 hours!'));
			}
		});


	},
};