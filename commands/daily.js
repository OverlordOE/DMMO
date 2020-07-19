const Discord = require('discord.js');
module.exports = {
	name: 'daily',
	summary: 'Get a daily gift',
	description: 'Get a daily gift.',
	category: 'money',
	aliases: ['day', 'd'],
	args: false,
	cooldown: 5,
	usage: '',

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {

		const daily = await character.getDaily(message.author.id);
		const embed = new Discord.MessageEmbed()
			.setTitle('Daily Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		if (daily === true) {
			const reward = 20 + Math.floor(Math.random() * 20);
			character.addMoney(message.author.id, reward);
			await character.setDaily(message.author.id);
			const balance = await character.getBalance(message.author.id);
			message.channel.send(embed.setDescription(`You got **${reward}💰** from your daily 🎁.\nCome back in a day for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your daily 🎁\n\nYou can get your next daily __${daily}__`)); }
	},
};