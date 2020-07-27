const Discord = require('discord.js');
const itemInfo = require('../data/items');
module.exports = {
	name: 'profile',
	summary: 'Shows profile of you or the tagger user',
	description: 'Shows profile of you or the tagger user.',
	category: 'info',
	aliases: ['inv', 'items', 'prof', 'inventory', 'balance', 'money', 'p'],
	args: false,
	usage: '<user>',


	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {
		const target = message.mentions.users.first() || message.author;
		const items = await character.getInventory(target.id);
		const filter = (reaction, user) => {
			return user.id === message.author.id;
		};

		const avatar = target.displayAvatarURL();
		const userProfile = await character.getUser(target.id);
		const levelInfo = await character.levelInfo(target.id, message);

		const userClass = await character.getClass(target.id);
		let className;
		let colour;
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

		let daily = await character.getDaily(target.id);
		let hourly = await character.getHourly(target.id);
		let weekly = await character.getWeekly(target.id);
		let vote = await character.getVote(target.id);

		if (daily === true) daily = 'now';
		if (hourly === true) hourly = 'now';
		if (weekly === true) weekly = 'now';
		if (vote === true) vote = 'now';

		const characterEmbed = new Discord.MessageEmbed()

			.setTitle(`**${target.tag}'s Character Stats**`)
			.setThumbnail(avatar)
			.setColor(colour)
			.addField('Class:', `${className} ${levelInfo.level}`, true)
			.addField('EXP:', exp, true)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		const equipmentEmbed = new Discord.MessageEmbed()

			.setTitle(`**${target.tag}'s Equipment**`)
			.setThumbnail(avatar)
			.setColor(colour)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		const moneyEmbed = new Discord.MessageEmbed()

			.setTitle(`**${target.tag}'s General Stats**`)
			.setThumbnail(avatar)
			.setColor(colour)
			.addField('Balance:', `${userProfile.balance.toFixed(1)}💰`)
			.addField('Next daily:', daily, true)
			.addField('Next hourly:', hourly, true)
			.addField('Next weekly:', weekly, true)
			.addField('Next Vote', vote, true)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		const inventoryEmbed = new Discord.MessageEmbed()

			.setTitle(`${target.tag}'s Inventory`)
			.setThumbnail(avatar)
			.setColor(colour)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		let inventory = '__**Inventory:**__\n';
		if (items.length) {
			items.map(i => {
				if (i.amount < 1) return;
				const item = itemInfo[i.name];
				inventory += `${item.emoji}__${i.name}__: **x${i.amount}**\n`;
			});
			inventoryEmbed.setDescription(inventory);
		}
		else { inventoryEmbed.addField('Inventory:', `*${target.tag}* has nothing!`); }


		if (userClass) {
			const stats = await character.getStats(target.id);
			const baseStats = await character.getBaseStats(target.id);
			characterEmbed.addFields(
				{ name: 'Health', value: `${msgUser.curHP}/${stats.hp}<:health:730849477765890130>`, inline: true },
				{ name: 'Mana', value: `${msgUser.curMP}/${stats.mp}<:mana:730849477640061029>`, inline: true },
			);

			let statDescription = '';
			for (const stat in stats) {
				if (baseStats[stat]) statDescription += `\n**${character.stringToName(stat)}**: ${stats[stat]} (${stats[stat] - baseStats[stat]})`;
				else statDescription += `\n**${character.stringToName(stat)}**: ${stats[stat]}`;
			}
			characterEmbed.setDescription(statDescription);

			const equipment = await character.getEquipment(target.id);
			let equipmentDescription = '';
			for (const slot in equipment) {
				if (equipment[slot]) {
					const item = character.getItem(equipment[slot]);
					equipmentDescription += `\n**${character.stringToName(slot)}**: ${item.emoji}${character.stringToName(item.name)}`;
				} else { equipmentDescription += `\n**${character.stringToName(slot)}**: Nothing`; }
			}
			equipmentEmbed.setDescription(equipmentDescription);
		}
		else {
			characterEmbed.setDescription(`${target} does not have a class yet.\n\nTo choose a class use the command \`class\`.`);
			equipmentEmbed.setDescription(`${target} does not have a class yet.\n\nTo choose a class use the command \`class\`.`);
		}

		message.channel.send(characterEmbed)
			.then(sentMessage => {
				sentMessage.react('730807684865065005');
				sentMessage.react('🛡️');
				sentMessage.react('💰');
				sentMessage.react('📦');
				const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);
					if (reaction.emoji.name == 'character') { sentMessage.edit(characterEmbed); }
					else if (reaction.emoji.name == '🛡️') { sentMessage.edit(equipmentEmbed); }
					else if (reaction.emoji.name == '💰') { sentMessage.edit(moneyEmbed); }
					else if (reaction.emoji.name == '📦') { sentMessage.edit(inventoryEmbed); }
				});
				collector.on('end', () => sentMessage.reactions.removeAll());
			});
	},
};
