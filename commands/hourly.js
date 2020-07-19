const Discord = require('discord.js');
module.exports = {
	name: 'hourly',
	summary: 'Get an hourly gift',
	description: 'Get an hourly gift.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',
	cooldown: 5,
	category: 'money',

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {

		const hourly = await character.getHourly(message.author.id);
		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		if (hourly === true) {
			const reward = 3 + Math.floor(Math.random() * 6);
			character.addMoney(message.author.id, reward);
			await character.setHourly(message.author.id);
			const balance = await character.getBalance(message.author.id);
			message.channel.send(embed.setDescription(`You got **${reward}💰** from your hourly 🎁.\nCome back in an hour for more!\n\nYour current balance is **${balance}💰**`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};