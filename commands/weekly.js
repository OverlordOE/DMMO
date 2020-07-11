const Discord = require('discord.js');
module.exports = {
	name: 'weekly',
	summary: 'Get a weekly gift',
	description: 'Get a weekly gift.',
	category: 'money',
	aliases: ['week', 'w'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		const weekly = await profile.getWeekly(message.author.id);
		const embed = new Discord.MessageEmbed()
			.setTitle('Weekly Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		if (weekly === true) {
			const reward = 120 + Math.floor(Math.random() * 60);
			profile.addMoney(message.author.id, reward);
			await profile.setWeekly(message.author.id);
			const balance = await profile.getBalance(message.author.id);
			message.channel.send(embed.setDescription(`You got **${reward}💰** from your weekly 🎁.\nCome back in a week for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your weekly 🎁\n\nYou can get your next weekly __${weekly}__`)); }
	},
};