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
	usage: '<user>',


	async execute(message, args, msgUser, profile, guildProfile, client, logger, cooldowns) {
		if (!msgUser.class) {
			const avatar = message.author.displayAvatarURL();
			const filter = (reaction, user) => {
				return [emojicharacters[1], emojicharacters[2], emojicharacters[3], emojicharacters[4], emojicharacters[5], emojicharacters[6], emojicharacters[7], emojicharacters[8], '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
			};
			let curClass = classes.warrior;

			const embed = new Discord.MessageEmbed()

				.setTitle('**Class Selection**')
				.setThumbnail(avatar)
				.setColor(curClass.colour)
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
			Once you have chosen your class press ✅ to confirm your class`)

				.setTimestamp()
				.setFooter('DMMO', client.user.displayAvatarURL());


			message.channel.send(embed)
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
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[2]:
								curClass = classes.rogue;
								sentMessage.edit(embed.setTitle('Rogue').setColor(curClass.colour).setDescription(`
							rogue, todo
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[3]:
								curClass = classes.hunter;
								sentMessage.edit(embed.setTitle('Hunter').setColor(curClass.colour).setDescription(`
							hunter
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[4]:
								curClass = classes.gunner;
								sentMessage.edit(embed.setTitle('Gunner').setColor(curClass.colour).setDescription(`
							gunner
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[5]:
								curClass = classes.monk;
								sentMessage.edit(embed.setTitle('Monk').setColor(curClass.colour).setDescription(`
							monk
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[6]:
								curClass = classes.crusader;
								sentMessage.edit(embed.setTitle('Crusader').setColor(curClass.colour).setDescription(`
							crusader
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[7]:
								curClass = classes.wizard;
								sentMessage.edit(embed.setTitle('Wizard').setColor(curClass.colour).setDescription(`
							wizard
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case emojicharacters[8]:
								curClass = classes.warlock;
								sentMessage.edit(embed.setTitle('Warlock').setColor(curClass.colour).setDescription(`
							warlock
			
							Usable equipment types:

							Starting equipment:

							Base stats:
							__Health__: **${curClass.stats.base.hp}**
							__Mana__: **${curClass.stats.base.mp}**
							__Strength__: **${curClass.stats.base.str}**
							__Dexterity__: **${curClass.stats.base.dex}**
							__Constitution__: **${curClass.stats.base.con}**
							__Intelligence__: **${curClass.stats.base.int}**
							Once you have chosen your class press ✅ to confirm your class`));
								break;

							case '✅':
								profile.setClass(message.author.id, curClass);
								sentMessage.edit(embed.setColor(curClass.colour).setDescription(`You have chosen the class ${curClass.name}`));
								break;
						}

					});
				});
		}
		else message.reply('You have already chosen your class');
	},
};
