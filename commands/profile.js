const Discord = require('discord.js');
module.exports = {
	name: 'profile',
	summary: 'Shows profile of you or the tagger user',
	description: 'Shows profile of you or the tagger user.',
	category: 'info',
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p'],
	args: false,
	usage: '<user>',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const target = message.mentions.users.first() || message.author;
		const items = await profile.getInventory(target.id);
		const filter = (reaction, user) => {
			return ['💰', '📦'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const avatar = target.displayAvatarURL();
		const userProfile = await profile.getUser(target.id);
		const levelInfo = await profile.nextLevel(target.id);

		const userClass = await profile.getClass(target.id);
		let className;
		let colour
		if (userClass) {
			className = userClass.name;
			colour = userClass.colour;
		}
		else {
			className = 'No class';
			colour = '#ffffff';
		}

		let exp = `${levelInfo.exp}/${levelInfo.expNeeded}`;
		if (levelInfo.level == 60) exp = '__**Max**__';

		let daily = await profile.getDaily(target.id);
		let hourly = await profile.getHourly(target.id);
		let weekly = await profile.getWeekly(target.id);
		let vote = await profile.getVote(target.id);

		if (daily === true) daily = 'now';
		if (hourly === true) hourly = 'now';
		if (weekly === true) weekly = 'now';
		if (vote === true) vote = 'now';


		const moneyEmbed = new Discord.MessageEmbed()

			.setTitle(`**${target.tag}'s General Stats**`)
			.setThumbnail(avatar)
			.setColor(colour)
			.addField('Class:', `${className} ${levelInfo.level}`, true)
			.addField('EXP:', exp, true)
			.addField('Balance:', `${userProfile.balance.toFixed(1)}💰`)
			.addField('Next daily:', daily, true)
			.addField('Next hourly:', hourly, true)
			.addField('Next weekly:', weekly, true)
			.addField('Next Vote', vote, true)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		const invEmbed = new Discord.MessageEmbed()

			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setColor(colour)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		let inventory = '__**Inventory:**__\n';
		if (items.length) {
			items.map(i => {
				if (i.amount < 1) return;
				inventory += `${i.base.emoji}__${i.name}__: **x${i.amount}**\n`;
			});
			invEmbed.setDescription(inventory);
		}
		else { invEmbed.addField('Inventory:', `*${target.tag}* has nothing!`); }


		message.channel.send(moneyEmbed)
			.then(sentMessage => {
				sentMessage.react('💰');
				sentMessage.react('📦');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);
					if (reaction.emoji.name == '💰') { sentMessage.edit(moneyEmbed); }
					else if (reaction.emoji.name == '📦') { sentMessage.edit(invEmbed); }
				});
			});
	},
};
