const Discord = require('discord.js');
const { exitOnError } = require('winston');
module.exports = {
	name: 'quest',
	summary: 'Go on a quest to kill mobs',
	description: 'Go on a quest to kill mobs.',
	aliases: ['q'],
	category: 'money',
	args: false,
	usage: '',

	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {

		if (!msgUser.baseStats) return message.reply('you need to have a class to quest.\nUse the command `class` to choose a class');
		if (msgUser.curHP < 1) return message.reply('you dont have enough hp to quest.\nDrink a healing potion or rest at an inn to regain **HP**.');
		const stats = JSON.parse(msgUser.baseStats);
		const userskills = JSON.parse(msgUser.skills);
		const userClass = await character.getClass(message.author.id);

		let playerDmg = 0;
		let playerDmgMod = 1;
		let playerDmgDebuff = 1;
		let monsterDmg = 0;
		let monsterDmgMod = 1;
		let monsterDmgDebuff = 1;
		let totalDamage;

		const userSkillList = [];
		const userSkillEmojis = [];
		let i;
		for (i in userskills) {
			const skill = character.getSkill(userskills[i]);
			if (skill) {
				userSkillList.push(skill);
				userSkillEmojis.push(skill.emoji);
			}
			else {
				userSkillList.push(null);
				userSkillEmojis.push(null);
			}
		}
		const monster = {
			name: 'test monster',
			damage: [5, 5],
			hp: 200,
			picture: 'monster_1.png',
		};
		let description = '';
		const filter = (reaction, user) => {
			return (userSkillEmojis.includes(reaction.emoji.name) || ['👏'].includes(reaction.emoji.name)) && user.id === message.author.id;
		};

		const embed = new Discord.MessageEmbed()
			.setTitle('DMMO Questing')
			.setColor(userClass.colour)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		if (monster.picture) embed.attachFiles(`assets/monsters/${monster.picture}`)
			.setThumbnail(`attachment://${monster.picture}`);

		message.channel.send(embed.addFields([
			{ name: `__${monster.name}__'s HP`, value: monster.hp, inline: true },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Health', value: `${msgUser.curHP}/${stats.hp}`, inline: true },
			{ name: 'Mana', value: `${msgUser.curMP}/${stats.mp}`, inline: true },
		]))
			.then(sentMessage => {
				setEmbed();
				sentMessage.react('👏');
				for (let i = 0; i < userSkillEmojis.length; i++) if (userSkillEmojis[i]) sentMessage.react(userSkillEmojis[i]);

				const collector = sentMessage.createReactionCollector(filter);

				collector.on('collect', (reaction) => {

					reaction.users.remove(message.author.id);
					playerTurn(reaction);
				});
				collector.on('end', () => sentMessage.reactions.removeAll());

				function playerTurn(reaction) {

					if (reaction.emoji.name == '👏') {

						playerDmg += (stats.str / 5) + 5;
						totalDamage = Math.floor(playerDmg * playerDmgMod);
						monster.hp -= totalDamage;
						description += `_**You**_ use __*Clap*__ and deal __**${totalDamage}**__ damage to __${monster.name}__.\n`;
					}
					else {
						const skill = userSkillList[userSkillEmojis.indexOf(reaction.emoji.name)];

						// Remove Mana
						const manaCost = Math.floor(stats.mp * skill.manaCost);
						if (msgUser.curMP < manaCost) {
							return message.reply(`${skill.name} costs ${manaCost}<:mana:730849477640061029> to use but you only have ${msgUser.curMP}<:mana:730849477640061029>`).then(manaMessage => {
								manaMessage.delete({ timeout: 5000 });
							});
						}
						msgUser.curMP -= manaCost;


						// add buffs
						if (skill.add) {
							for (const skillEffect in skill.add) {
								if (skill.add.damage) playerDmg += skill.add.damage;
								else stats[skillEffect] += skill.add[skillEffect];
							}
						}
						if (skill.mult) {
							for (const skillEffect in skill.mult) {
								if (skill.mult.damage) playerDmgMod += skill.mult.damage;
								else stats[skillEffect] *= skill.mult[skillEffect] + 1;
							}
						}
						if (skill.debuff) {
							for (const skillEffect in skill.debuff) {
								if (skill.debuff.damage) monsterDmgDebuff += skill.debuff.damage;
								else stats[skillEffect] *= skill.debuff[skillEffect] + 1;
							}
						}


						if (skill.type == 'attack') {
							playerDmg += (stats.str / 5) + 5;
							console.log(playerDmg);
							console.log(playerDmgMod);
							console.log(playerDmgDebuff);
							totalDamage = Math.floor(playerDmg * playerDmgMod * playerDmgDebuff * (1 + (Math.random() * 0.1)));
							monster.hp -= totalDamage;
							description += `_**You**_ use __*${skill.name}*__ and deal __**${totalDamage}**__ damage to __${monster.name}__.\n`;
						}
						else description += `_**You**_ use __*${skill.name}*__.\n`;
					}
					if (monster.hp <= 0) {
						description += `\n_**You**_ have slain __${monster.name}__!\n`;
						endGame(100);
						return setEmbed();
					}

					setEmbed();

					playerDmg = 0;
					playerDmgMod = 1;
					playerDmgDebuff = 1;

					setTimeout(() => monsterTurn(), 1000);
				}

				function monsterTurn() {

					monsterDmg = (monster.damage[0] + (monster.damage[1] * Math.random())) + msgUser.level;
					totalDamage = Math.floor(monsterDmg * monsterDmgMod * monsterDmgDebuff * (1 + (Math.random() * 0.1)));
					msgUser.curHP -= totalDamage;
					description += `_**${monster.name}**_ uses __*Bite*__ and deals __**${totalDamage}**__ damage to __you__.\n\n`;

					if (msgUser.curHP <= 0) {
						msgUser.curHP = stats.hp;
						description += `\n_**You**_ fainted to __${monster.name}__ and wake up back in town\n\n`;
						collector.stop();
						endGame(20);
					}
					setEmbed();

					monsterDmg = 0;
					monsterDmgMod = 1;
					monsterDmgDebuff = 1;
				}

				function endGame(exp) {
					msgUser.curMP = stats.mp;
					const reward = Math.floor((exp + (Math.random() * exp / 5)) * msgUser.level);
					character.addExp(message.author.id, reward, message);
					description += `\n_**You**_ gained **${reward}** EXP.\n`;
					collector.stop();
				}

				function setEmbed() {
					sentMessage.edit(embed
						.spliceFields(0, 4, [
							{ name: `__${monster.name}__'s HP`, value: `${monster.hp}<:health:730849477765890130>`, inline: true },
							{ name: '\u200B', value: '\u200B' },
							{ name: 'Health', value: `${msgUser.curHP} / ${stats.hp} <:health:730849477765890130>`, inline: true },
							{ name: 'Mana', value: `${msgUser.curMP}/${stats.mp}<:mana:730849477640061029>`, inline: true },
						])
						.setDescription(description));
				}
			});
	},
};
