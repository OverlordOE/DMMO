const Discord = require('discord.js');
const emojicharacters = require('../data/emojiCharacters');
const classes = require('../data/classes');
module.exports = {
	name: 'class',
	summary: 'Choose your class',
	description: 'Choose your class that you will use. You can reset your client.characterCommands by using this command again.',
	category: 'pvp',
	aliases: ['classes'],
	args: false,
	usage: '',


	async execute(message, args, msgUser, client, logger) {


		const embed = new Discord.MessageEmbed()
			.setTitle('**Class Selection**')
			.setThumbnail(message.author.displayAvatarURL())
			.setTimestamp()
			.setFooter('DMMO', client.user.displayAvatarURL());

		if (!msgUser.class) {
			let curClass = classes.warrior;
			const filter = (reaction, user) => {
				return [emojicharacters[1], emojicharacters[2], emojicharacters[3], '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			message.channel.send(embed)
				.then(sentMessage => {
					setClass(curClass, sentMessage, embed);
					for (let i = 1; i < 4; i++) sentMessage.react(emojicharacters[i]);
					sentMessage.react('✅');

					const collector = sentMessage.createReactionCollector(filter, { time: 180000 });

					collector.on('collect', (reaction) => {
						reaction.users.remove(message.author.id);

						switch (reaction.emoji.name) {
							case emojicharacters[1]:
								curClass = classes.warrior;
								break;

							case emojicharacters[2]:
								curClass = classes.ranger;
								break;

							case emojicharacters[3]:
								curClass = classes.wizard;
								break;

							case '✅':
								try {
									client.characterCommands.setClass(msgUser, curClass);
								}
								catch (error) {
									return sentMessage.edit(embed.setColor(curClass.colour).setDescription('Something went wrong'));
								}
								sentMessage.edit(embed.setColor(curClass.colour).setDescription(`You have chosen the class ${curClass.name}`));
								return sentMessage.reactions.removeAll();
						}
						setClass(curClass, sentMessage, embed);
					});
					collector.on('end', () => sentMessage.reactions.removeAll());
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
						.then(() => {
							client.characterCommands.resetClass(msgUser);
							sentMessage.edit(embed.setDescription('Class reset.'));
							sentMessage.reactions.removeAll();
						});
				});
		}
	},
};

function setClass(curClass, sentMessage, embed) {
	sentMessage.edit(embed.setTitle(curClass.name)
		.setColor(curClass.colour).setDescription(`
					${curClass.description}

					Base stats:
					__Health__: **${curClass.stats.base.maxHP}**
					__Mana__: **${curClass.stats.base.maxMP}**
					__Strength__: **${curClass.stats.base.Strength}**
					__Dexterity__: **${curClass.stats.base.Dexterity}**
					__Constitution__: **${curClass.stats.base.Constitution}**
					__Intelligence__: **${curClass.stats.base.Intelligence}**
					\nOnce you have chosen your class press ✅ to confirm your class`)
	);
}