const Sequelize = require('sequelize');
const moment = require('moment');
const Discord = require('discord.js');
const character = new Discord.Collection();
const guildProfile = new Discord.Collection();
require('dotenv').config();
const prefix = process.env.PREFIX;

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('models/Users');
const Guilds = sequelize.import('models/Guilds');
const UserItems = sequelize.import('models/UserItems');
const UserSkills = sequelize.import('models/UserSkills');
const items = require('./data/items');
const skills = require('./data/skills');

// ITEMS
Reflect.defineProperty(character, 'addItem', {
	value: async function addItem(id, item, amount) {
		const userItem = await UserItems.findOne({
			where: { user_id: id, name: item.name },
		});

		if (userItem) {
			userItem.amount += parseInt(amount);
			return userItem.save();
		}

		return UserItems.create({
			user_id: id,
			name: item.name,
			amount: parseInt(amount),
		});
	},
});
Reflect.defineProperty(character, 'removeItem', {
	value: async function removeItem(id, item, amount) {
		const userItem = await UserItems.findOne({
			where: { user_id: id, name: item.name },
		});

		const remove = parseInt(amount);
		if (userItem.amount >= remove) {
			userItem.amount -= remove;
			return userItem.save();
		}

		throw Error(`User doesn't have the item: ${item.name}`);
	},
});

Reflect.defineProperty(character, 'getInventory', {
	value: async function getInventory(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		return UserItems.findAll({
			where: { user_id: id },
		});
	},
});
Reflect.defineProperty(character, 'getItem', {
	value: function getItem(itemName) {
		if (items[itemName]) return items[itemName];
		return false;
	},
});

Reflect.defineProperty(character, 'equip', {
	value: async function equip(id, equipment) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const userEquipment = await UserItems.findOne({
			where: { user_id: id, name: equipment.name },
		});
		if (userEquipment) {
			const equipped = JSON.parse(user.skills);
			// const userClass = JSON.parse(user.class);
			// if (userClass.name == equipment.class || equipment.class == 'all') {

			if (equipment.slot == 'both hands') {
				equipped['main hand'] == equipment.name;
				equipped['off hand'] == equipment.name;
			}
			else if (equipment.slot == 'off hand' || equipment.slot == 'main hand') {

				if (equipped['main hand']) {
					const mainHand = items[equipped['main hand']];

					if (mainHand.slot == 'both hands') {
						equipped['main hand'] == null;
						equipped['off hand'] == null;
					}
				}
				equipped[equipment.slot] = equipment.name;
			}
			else equipped[equipment.slot] = equipment.name;

			user.equipment = JSON.stringify(equipped);
			character.calculateStats(id);
			return user.save();
			// }
		}
		return false;
	},
});


// SKILLS
Reflect.defineProperty(character, 'addSkill', {
	value: async function addSkill(id, skill) {
		const userSkill = await UserSkills.findOne({
			where: { user_id: id, name: skill.name },
		});
		if (userSkill) throw Error('User already has that skill');

		return UserSkills.create({
			user_id: id,
			name: skill.name,
		});
	},
});
Reflect.defineProperty(character, 'removeSkill', {
	value: async function removeSkill(id, skill) {
		const userSkill = await UserSkills.findOne({
			where: { user_id: id, name: skill.name },
		});

		if (userSkill) return userSkill.destroy();
		throw Error(`User doesn't have the skill: ${skill.name}`);
	},
});

Reflect.defineProperty(character, 'getCharacterSkills', {
	value: async function getInventory(id) {
		return UserSkills.findAll({ where: { user_id: id } });
	},
});
Reflect.defineProperty(character, 'getSkill', {
	value: function getSkill(skillName) {
		if (skills[skillName]) return skills[skillName];
		return false;
	},
});
Reflect.defineProperty(character, 'setSkill', {
	value: async function hasSkill(id, skill, slot) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const userSkill = await UserSkills.findOne({
			where: { user_id: id, name: skill.name },
		});
		if (userSkill) {
			const equippedSkills = JSON.parse(user.skills);
			const userClass = JSON.parse(user.class);
			if (userClass.name == skill.class || skill.class == 'all') {
				equippedSkills[slot] = skill.name;
				user.skills = JSON.stringify(equippedSkills);
				return user.save();
			}
		}
		return false;
	},
});


// CLASS
Reflect.defineProperty(character, 'resetClass', {
	value: async function resetClass(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		user.class = null;
		user.baseStats = null;
		user.stats = null;
		user.equipment = null;
		user.skills = null;
		user.curHP = null;
		user.curMP = null;
		user.level = 1;
		user.exp = 0;

		return user.save();
	},
});
Reflect.defineProperty(character, 'setClass', {
	value: async function setClass(id, c) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		user.curHP = c.stats.base.hp;
		user.curMP = c.stats.base.mp;
		user.class = JSON.stringify(c);
		user.baseStats = JSON.stringify(c.stats.base);

		user.skills = JSON.stringify(c.startSkills);
		for (let i = 0; i < c.startSkills.length; i++) {
			const skill = character.getSkill(c.startSkills[i]);
			await character.addSkill(id, skill);
			await character.setSkill(id, skill, i + 1);
		}

		for (let i = 0; i < c.startEquipment.length; i++) {
			const equipment = character.getItem(c.startEquipment[i]);
			await character.addItem(id, equipment);
			await character.equip(id, equipment);
		}

		return user.save();
	},
});
Reflect.defineProperty(character, 'getClass', {
	value: async function getClass(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		if (!user.class) return null;
		return user ? JSON.parse(user.class) : null;
	},
});

Reflect.defineProperty(character, 'addExp', {
	value: async function addExp(id, amount, message) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const classInfo = await character.getClass(id);
		if (!classInfo) {
			return message.reply(
				'You dont have a class yet so you cant gain experience!\nUse the command `class` to get a class`',
			);
		}

		user.exp += Number(amount);
		user.save();
		return character.levelInfo(id, message);
	},
});
Reflect.defineProperty(character, 'levelInfo', {
	value: async function levelInfo(id, message) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		const exponent = 1.5;
		const baseExp = 1000;
		let expNeeded =
			(baseExp / 10) *
			Math.floor((baseExp / 100) * Math.pow(user.level, exponent));

		while (user.exp >= expNeeded && user.level < 60) {
			const classInfo = await character.getClass(id);
			if (!classInfo) {
				message.reply(
					'You dont have a class yet so you cant gain experience!\nUse the command `class` to get a class`',
				);
				return {
					level: user.level,
					exp: user.exp,
					expNeeded: expNeeded,
				};
			}
			const statGrowth = classInfo.stats.growth;
			const stats = JSON.parse(user.baseStats);

			user.level++;
			user.exp -= expNeeded;
			expNeeded =
				(baseExp / 10) *
				Math.floor((baseExp / 100) * Math.pow(user.level, exponent));
			stats.hp += statGrowth.hp;
			user.curHP += statGrowth.hp;
			stats.mp += statGrowth.mp;
			user.curMP += statGrowth.mp;
			stats.str += statGrowth.str;
			stats.dex += statGrowth.dex;
			stats.con += statGrowth.con;
			stats.int += statGrowth.int;
			user.baseStats = JSON.stringify(stats);
			user.save();

			message.reply(`you have leveled up to level ${user.level}.
			You gain the following stat increases:
			**${statGrowth.hp}** HP
			**${statGrowth.mp}** MP
			**${statGrowth.str}** STR
			**${statGrowth.dex}** DEX
			**${statGrowth.con}** CON
			**${statGrowth.int}** INT
			`);
		}

		return {
			level: user.level,
			exp: user.exp,
			expNeeded: expNeeded,
		};
	},
});


// STATS
Reflect.defineProperty(character, 'getBaseStats', {
	value: async function getBaseStats(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		if (!user.class) return null;
		return user ? JSON.parse(user.baseStats) : null;
	},
});
Reflect.defineProperty(character, 'getStats', {
	value: async function getStats(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		if (!user.class) return null;
		return user ? JSON.parse(user.stats) : null;
	},
});
Reflect.defineProperty(character, 'calculateStats', {
	value: async function calculateStats(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		if (!user.class) throw Error('User does not have a class');
		const baseStats = JSON.parse(user.baseStats);

		const stats = {


		};


		user.stats = JSON.stringify(stats);
		user.save();
		return stats;
	},
});


// USERS
Reflect.defineProperty(character, 'getUser', {
	value: async function getUser(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		return user;
	},
});

Reflect.defineProperty(character, 'addMoney', {
	value: async function addMoney(id, amount) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		user.balance += Number(amount);
		return user.save();
	},
});
Reflect.defineProperty(character, 'getBalance', {
	value: async function getBalance(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		return user ? Math.floor(user.balance) : 0;
	},
});

Reflect.defineProperty(character, 'getDaily', {
	value: async function getDaily(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const now = moment();

		const dCheck = moment(user.lastDaily).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('dddd HH:mm');
	},
});
Reflect.defineProperty(character, 'setDaily', {
	value: async function setDaily(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		const currentDay = moment();
		user.lastDaily = currentDay;
		return user.save();
	},
});

Reflect.defineProperty(character, 'getHourly', {
	value: async function getHourly(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const now = moment();

		const hCheck = moment(user.lastHourly).add(1, 'h');
		if (moment(hCheck).isBefore(now)) return true;
		else return hCheck.format('dddd HH:mm');
	},
});
Reflect.defineProperty(character, 'setHourly', {
	value: async function setHourly(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		const day = moment();
		user.lastHourly = day;
		return user.save();
	},
});

Reflect.defineProperty(character, 'getWeekly', {
	value: async function getWeekly(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const now = moment();

		const wCheck = moment(user.lastWeekly).add(1, 'w');
		if (moment(wCheck).isBefore(now)) return true;
		else return wCheck.format('dddd HH:mm');
	},
});
Reflect.defineProperty(character, 'setWeekly', {
	value: async function setWeekly(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		const day = moment();
		user.lastWeekly = day;
		return user.save();
	},
});

Reflect.defineProperty(character, 'setVote', {
	value: async function setVote(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);

		const day = moment();
		user.lastVote = day;
		return user.save();
	},
});
Reflect.defineProperty(character, 'getVote', {
	value: async function getVote(id) {
		let user = character.get(id);
		if (!user) user = await character.newUser(id);
		const now = moment();

		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('dddd HH:mm');
	},
});

Reflect.defineProperty(character, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			balance: 1,
			level: 1,
			exp: 0,
			lastDaily: now.subtract(2, 'days'),
			lastHourly: now.subtract(1, 'days'),
			lastWeekly: now.subtract(8, 'days'),
			lastVote: now.subtract(1, 'days'),
			stats: {},
		});
		character.set(id, user);
		return user;
	},
});


// GUILDS
Reflect.defineProperty(guildProfile, 'newGuild', {
	value: async function newGuild(id) {
		const guild = await Guilds.create({
			guild_id: id,
			prefix: prefix,
		});
		guildProfile.set(id, guild);
		return guild;
	},
});

Reflect.defineProperty(guildProfile, 'getPrefix', {
	value: async function getPrefix(id) {
		let guild = guildProfile.get(id);
		if (!guild) guild = await guildProfile.newGuild(id);
		return guild ? guild.prefix : 0;
	},
});
Reflect.defineProperty(guildProfile, 'setPrefix', {
	value: async function setPrefix(id, newPrefix) {
		let guild = guildProfile.get(id);
		if (!guild) guild = await guildProfile.newGuild(id);

		guild.prefix = newPrefix;
		return guild.save();
	},
});

module.exports = { Users, Guilds, UserItems, character, guildProfile };
