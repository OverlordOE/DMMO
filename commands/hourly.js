const Discord = require('discord.js');
module.exports = {
	name: 'hourly',
	summary: 'Get an hourly gift',
	description: 'Get an hourly gift and part of your passive income from your collectables.',
	aliases: ['h', 'hour'],
	args: false,
	usage: '',

	category: 'economy',

	async execute(message, args, msgUser, client, logger) {
		const hourly = client.characterCommands.getHourly(msgUser);
		let chest;

		const luck = Math.floor(Math.random() * 6);
		if (luck == 0) chest = 'Mystery Chest';
		else if (luck == 1 || luck == 2) chest = 'Rare chest';
		else chest = 'Common Chest';
		chest = client.characterCommands.getItem(chest);

		const embed = new Discord.MessageEmbed()
			.setTitle('Hourly Reward')
			.setThumbnail(message.author.displayAvatarURL())
			.setColor(client.characterCommands.getColour(msgUser))

			.setFooter('You can see how much income you get on your client.characterCommands.', client.user.displayAvatarURL());


		if (hourly === true) {
			if (chest.picture) embed.attachFiles(`assets/items/${chest.picture}`)
				.setImage(`attachment://${chest.picture}`);

			const income = await client.characterCommands.calculateIncome(msgUser);
			const balance = client.characterCommands.addMoney(msgUser, income.hourly);
			client.characterCommands.addItem(msgUser, chest);
			client.characterCommands.setHourly(msgUser);

			message.channel.send(embed.setDescription(`You got a ${chest.emoji}${chest.name} from your hourly 🎁 and ${client.util.formatNumber(income.hourly)}💰 from your collectables.\nCome back in an hour for more!\n\nYour current balance is ${client.util.formatNumber(balance)}💰`));
		}
		else { message.channel.send(embed.setDescription(`You have already gotten your hourly 🎁\n\nYou can get your next hourly __${hourly}__.`)); }

	},
};