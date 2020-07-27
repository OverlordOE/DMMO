const Discord = require('discord.js');
const skillInfo = require('../data/skills');
module.exports = {
	name: 'myskills',
	summary: 'Equip and look at your available skills',
	description: 'Equip and look at your available skills.',
	category: 'info',
	aliases: ['ms', 'myskill', 'setskill'],
	args: false,
	usage: '<user>',


	async execute(message, args, msgUser, character, guildProfile, client, logger, cooldowns) {
		const avatar = message.author.displayAvatarURL();
		const skills = await character.getCharacterSkills(message.author.id);

		const userClass = await character.getClass(message.author.id);
		let colour;
		if (userClass) colour = userClass.colour;
		else return message.reply('you need to have a class to equip skills.\nUse the command `class` to choose a class');


		let slot = 1;
		let temp = '';
		for (let i = 0; i < args.length; i++) {
			if (!(isNaN(args[i]))) slot = parseInt(args[i]);

			else if (temp.length > 2) temp += ` ${args[i]}`;
			else temp += `${args[i]}`;
		}
		const equipSkill = await character.getSkill(temp);
		if (equipSkill) {
			if (await character.setSkill(message.author.id, equipSkill, slot)) {
				message.reply(`Equipped ${equipSkill.name} to slot ${slot}`);
			}
			else message.reply('You dont have that skill or it is of the wrong class');
		}


		const embed = new Discord.MessageEmbed()

			.setTitle(`${message.author.tag}'s Skills`)
			.setThumbnail(avatar)
			.setColor(colour)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());


		let equippedSkills = '__**Equipped Skills:**__\nSlot/Name/Class/Type/Mana Cost\n\n';
		const equipped = JSON.parse(msgUser.skills);

		if (equipped) {
			for (let i = 1; i < 6; i++) {
				if (equipped[i]) {
					const skill = skillInfo[equipped[i]];
					equippedSkills += `**Slot ${i}**: ${skill.emoji} ${character.stringToName(equipped[i])} / ${skill.class} / ${skill.type} / ${skill.manaCost * 100}%\n`;
				}
				else equippedSkills += `**Slot ${i}**: Nothing\n`;
			}
		}
		else equippedSkills += '**Slot 1**: Nothing\n**Slot 2**: Nothing\n**Slot 3**: Nothing\n**Slot 4**: Nothing\n**Slot 5**: Nothing\n';

		let availableSkills = '__**Available Skills:**__\nName/Class/Type/Mana Cost\n\n';
		if (skills.length) {
			skills.map(s => {
				const skill = skillInfo[s.name];
				availableSkills += `${skill.emoji} ${character.stringToName(s.name)} / ${skill.class} / ${skill.type} / ${skill.manaCost * 100}%\n`;
			});
		}


		message.channel.send(embed.setDescription(`${equippedSkills}\n\n${availableSkills}`));
	},
};
