/* eslint-disable no-shadow */
/* eslint-disable max-nested-callbacks */
const Discord = require('discord.js');
module.exports = {
	name: 'quest',
	summary: 'Go on a quest to kill mobs',
	description: 'Go on a quest to kill mobs.',
	aliases: ['q'],
	category: 'money',
	args: false,
	usage: '',

	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {

		if (!msgUser.stats) return message.reply('you need to have a class to quest.\nUse the command `class` to choose a class');
		if (msgUser.curHP < 1) return message.reply('you dont have enough hp to quest.\nDrink a healing potion or rest at an inn to regain **HP**.');
		const stats = JSON.parse(msgUser.stats);
		const userClass = await profile.getClass(message.author.id);
		const monster = {
			name: 'test monster',
			damage: [5, 5],
			hp: 40,
			picture: 'monster_1.png',
		}
		let description = '';
		const filter = (reaction, user) => {
			return ['⚔️', '🛡️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Questing')
			.setColor(userClass.colour)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		if (monster.picture) embed.attachFiles(`assets/monsters/${monster.picture}`)
			.setThumbnail(`attachment://${monster.picture}`);

		message.channel.send(embed)
			.then(sentMessage => {
				setEmbed();
				sentMessage.react('⚔️');
				sentMessage.react('🛡️');
				const collector = sentMessage.createReactionCollector(filter);

				collector.on('collect', (reaction) => {
					reaction.users.remove(message.author.id);


					if (reaction.emoji.name == '⚔️') {
						const damage = Math.floor(stats.str / (3 + Math.random()));
						monster.hp -= damage;
						description += `_**You**_ use __*Slash*__ and deal __**${damage}**__ damage to __${monster.name}__.\n`;
						if (monster.hp <= 0) {
							const reward = Math.floor(50 + (Math.random() * 40));
							profile.addExp(message.author.id, reward, message);
							description += `\n_**You**_ have slain __${monster.name}__ and gained **${reward}** EXP!\n`;
							collector.stop();
						}
						setEmbed();
					}
					else if (reaction.emoji.name == '🛡️') { }

					setTimeout(() => {

						const damage = Math.floor(monster.damage[0] + (monster.damage[1] * Math.random()));
						msgUser.curHP -= damage;
						description += `_**${monster.name}**_ uses __*Bite*__ and deals __**${damage}**__ damage to __you__.\n`;
						if (msgUser.curHP <= 0) {
							msgUser.curHP = 0;
							description += `\n_**You**_ fainted to __${monster.name}__ and wake up back in town\n`;
							collector.stop();
						}
						setEmbed();

					}, 1000);


				});
				collector.on('end', () => sentMessage.reactions.removeAll());

				function setEmbed() {
					embed.spliceFields(0, 4, [
						{ name: `__${monster.name}__'s HP`, value: monster.hp, inline: true },
						{ name: '\u200B', value: '\u200B' },
						{ name: 'Health', value: `${msgUser.curHP}/${stats.hp}`, inline: true },
						{ name: 'Mana', value: `${msgUser.curMP}/${stats.mp}`, inline: true },
					])
						.setDescription(description);
					sentMessage.edit(embed);
				}
			});

	},
};
