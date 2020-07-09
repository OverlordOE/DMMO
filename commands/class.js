const Discord = require('discord.js');
const emojicharacters = require('../emojiCharacters');
const classes = require('../data/classes');
module.exports = {
	name: 'class',
	summary: 'Choose your class',
	description: 'Choose your class that you will use. Can only be choosen once.',
	category: 'info',
	aliases: [''],
	args: false,
	usage: '',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		const avatar = message.author.displayAvatarURL();

		const embed = new Discord.MessageEmbed()
			.setTitle('**Class Selection**')
			.setThumbnail(avatar)
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		if (!msgUser.class) {
			let curClass = classes.warrior;
			const filter = (reaction, user) => {
				return [emojicharacters[1], emojicharacters[2], emojicharacters[3], emojicharacters[4], emojicharacters[5], emojicharacters[6], emojicharacters[7], emojicharacters[8], '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			message.channel.send(embed.setColor(curClass.colour)
				.setColor(curClass.colour).setDescription(`
			The Warrior uses its overwhelming strength to crush any enemies in its path
			
			Usable equipment types:

			Starting equipment:

			Base stats:
			__Health__: **${curClass.stats.base.hp}**
			__Mana__: **${curClass.stats.base.mp}**
			__Strength__: **${curClass.stats.base.str}**
			__Dexterity__: **${curClass.stats.base.dex}**
			__Constitution__: **${curClass.stats.base.con}**
			__Intelligence__: **${curClass.stats.base.int}**
			\nOnce you have chosen your class press ✅ to confirm your class`))
				.then(sentMessage => {
					for (let i = 1; i < 9; i++) sentMessage.react(emojicharacters[i]);
					sentMessage.react('✅');

					const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

					collector.on('collect', (reaction) => {
						reaction.users.remove(message.author.id);

						switch (reaction.emoji.name) {
							case emojicharacters[1]:
								curClass = classes.warrior;
								sentMessage.edit(embed.setTitle('Warrior').setColor(curClass.colour).setDescription(`
							Warrior skills are centered around strength and physical combat.
							They have a wide variety of melee weapons, and the ability to survive while tanking for the group, usually at the cost of agility or range. 
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[2]:
								curClass = classes.rogue;
								sentMessage.edit(embed.setTitle('Rogue').setColor(curClass.colour).setDescription(`
							A rogue is a versatile character, capable of sneaky combat and nimble tricks. The rogue is stealthy and dexterous.
							This class is a fast melee class with a main focus on DPS.
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[3]:
								curClass = classes.hunter;
								sentMessage.edit(embed.setTitle('Hunter').setColor(curClass.colour).setDescription(`
							Hunters battle their foes at a distance, trying to take their best shot to damage the enemy or weaken him with poisonous arrows.
							The main focus of this class lays in DPS.
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[4]:
								curClass = classes.gunner;
								sentMessage.edit(embed.setTitle('Gunner').setColor(curClass.colour).setDescription(`
							As the Gunner, you are firepower, packing high amounts of damage through your rifle. 
							Rifles are kind of an experimental thing at the moment, so sorry for the reload time!
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[5]:
								curClass = classes.monk;
								sentMessage.edit(embed.setTitle('Monk').setColor(curClass.colour).setDescription(`
							The monk skills mostly incorporate physical and magic damage but also healing abilities.
							The monk is focused on mobility, being able to dash to enemies and move quickly around the battlefield.
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[6]:
								curClass = classes.crusader;
								sentMessage.edit(embed.setTitle('Crusader').setColor(curClass.colour).setDescription(`
							The crusader is built to stand endless attacks. 
							Crusaders protect allies at all costs while using holy magic, while some crusaders of a deeper, darker place use blood magic against their opponents to their advantage.
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[7]:
								curClass = classes.wizard;
								sentMessage.edit(embed.setTitle('Wizard').setColor(curClass.colour).setDescription(`
							Wizards are supreme magic-users, defined by the spells they cast. Drawing on the subtle weave of magic that permeates the cosmos.
							Wizards cast spells of explosive fire, arcing lightning and subtle deception.
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[8]:
								curClass = classes.warlock;
								sentMessage.edit(embed.setTitle('Warlock').setColor(curClass.colour).setDescription(`
							Warlocks are seekers of the knowledge that lies hidden. 
							Through pacts made with mysterious beings of supernatural power, warlocks unlock magical effects both subtle and spectacular.
							They use curses to bring down their enemies but they also use the help of dark demons.
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							\nOnce you have chosen your class press ✅ to confirm your class`));
								break;

							case '✅':
								profile.setClass(message.author.id, curClass);
								sentMessage.edit(embed.setColor(curClass.colour).setDescription(`You have chosen the class ${curClass.name}`));
								break;
						}

					});
				});
		}
		else {
			const filter = (reaction, user) => {
				return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
			};
			message.channel.send(embed.setDescription(`
			You have already chosen a class.

			If you want to reset your class press ✅.
			
			__**This will reset you back to level 1**.__`))
				.then(sentMessage => {
					sentMessage.react('✅');

					sentMessage.awaitReactions(filter, { max: 1, time: 60000 })
						.then(async () => {
							await profile.resetClass(message.author.id);
							sentMessage.edit(embed.setDescription('Class reset.'));
						});
				});
		}
	},
};
