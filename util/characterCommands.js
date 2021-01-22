/* eslint-disable no-multiple-empty-lines */
const Sequelize = require('sequelize');
const moment = require('moment');
const Discord = require('discord.js');
const characterCommands = new Discord.Collection();

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = sequelize.import('../models/Users');
const UserItems = sequelize.import('../models/UserItems');
const items = require('../data/items');
const classes = require('../data/classes');

Reflect.defineProperty(characterCommands, 'newUser', {
	value: async function newUser(id) {
		const now = moment();
		const user = await Users.create({
			user_id: id,
			balance: 0,
			totalEarned: 0,
			networth: 0,
			level: 1,
			exp: 0,
			equipment: JSON.stringify({ weapon: null, offhand: null }),
			lastDaily: now.subtract(2, 'days').toString(),
			lastHourly: now.subtract(1, 'days').toString(),
			lastVote: now.subtract(1, 'days').toString(),
			firstCommand: true,
		});
		characterCommands.set(id, user);
		return user;
	},
});
























// EQUIPMENT AND COMBAT

Reflect.defineProperty(characterCommands, 'getEquipment', {
	value: function getEquipment(user) {
		return JSON.parse(user.equipment);
	},
});

Reflect.defineProperty(characterCommands, 'equip', {
	value: async function equip(user, equipment) {

		const userEquipment = await UserItems.findOne({
			where: { user_id: user.user_id, name: equipment.name },
		});

		if (userEquipment) {
			const equipped = JSON.parse(user.equipment);

			equipped[equipment.slot] = equipment.name;
			user.equipment = JSON.stringify(equipped);
			return user.save();
		}
		throw Error(`${equipment} is not a valid item`);
	},
});




















// CLASS
Reflect.defineProperty(characterCommands, 'getClass', {
	value: function getClass(className) {
		const userClass = className.toLowerCase();
		if (classes[userClass]) return classes[userClass];
		return false;
	},
});


Reflect.defineProperty(characterCommands, 'resetClass', {
	value: function resetClass(user) {
		user.class = null;
		user.stats = null;
		user.baseStats = null;
		user.equipment = null;
		// user.skills = null;
		user.level = 1;
		user.exp = 0;

		return user.save();
	},
});
Reflect.defineProperty(characterCommands, 'setClass', {
	value: async function setClass(user, newClass) {

		user.class = newClass.name;
		user.baseStats = JSON.stringify(newClass.stats.base);
		user.equipment = JSON.stringify({
			'Main hand': null,
			'Off hand': null,
			'Head': null,
			'Chest': null,
			'Legs': null,
			// 'Necklace': null,
			// 'Shoulders': null,
			// 'Hands': null,
			// 'Feet': null,
			// 'Ring': null,
			// 'Trinket': null,
		});

		// user.skills = JSON.stringify(c.startSkills);
		// for (let i = 0; i < c.startSkills.length; i++) {
		// 	const skill = characterCommands.getSkill(c.startSkills[i]);
		// 	await characterCommands.addSkill(id, skill);
		// 	await characterCommands.setSkill(id, skill, i + 1);
		// }

		for (let i = 0; i < newClass.startEquipment.length; i++) {
			const equipment = characterCommands.getItem(newClass.startEquipment[i]);
			await characterCommands.addItem(user, equipment);
			characterCommands.equip(user, equipment);
		}

		await characterCommands.calculateStats(user);
		return user.save();
	},
});


// STATS
Reflect.defineProperty(characterCommands, 'getBaseStats', {
	value: function getBaseStats(user) {
		if (!user.class) return null;
		return JSON.parse(user.baseStats);
	},
});
Reflect.defineProperty(characterCommands, 'getStats', {
	value: function getStats(user) {
		if (!user.class) return null;
		return JSON.parse(user.stats);
	},
});
Reflect.defineProperty(characterCommands, 'calculateStats', {
	value: async function calculateStats(user) {
		if (!user.class) return false;

		const stats = JSON.parse(user.baseStats);
		stats.Critchance = 0;
		stats.Armor = 0;
		stats.Damage = 0;
		stats.Attackspeed = 0;

		const equipment = await characterCommands.getEquipment(user);
		for (const slot in equipment) {
			if (equipment[slot]) {
				const item = characterCommands.getItem(equipment[slot]);

				if (item.stats)
					for (const itemEffect in item.stats)
						stats[itemEffect] += item.stats[itemEffect];
			}
		}

		stats.maxHP += stats.Constitution * 4;
		stats.maxMP += stats.Intelligence * 4;
		stats.Armor += Math.round(stats.Dexterity * 1.5);
		stats.Critchance += stats.Dexterity / 8;

		user.stats = JSON.stringify(stats);
		user.save();
		return stats;
	},
});


Reflect.defineProperty(characterCommands, 'addExp', {
	value: function addExp(user, exp, message) {
		if (!user.class) return message.reply(
			'You dont have a class yet so you cant gain experience!\nUse the command `class` to get a class');

		user.exp += Number(exp);
		user.save();
		return characterCommands.levelInfo(user, message);
	},
});


Reflect.defineProperty(characterCommands, 'levelInfo', {
	value: function levelInfo(user, message) {
		const exponent = 1.5;
		const baseExp = 1000;
		let expNeeded =
			(baseExp / 10) *
			Math.floor((baseExp / 100) * Math.pow(user.level, exponent));

		while (user.exp >= expNeeded && user.level < 60) {
			const classInfo = characterCommands.getClass(user.class);
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
			expNeeded = (baseExp / 10) *
				Math.floor((baseExp / 100) * Math.pow(user.level, exponent));

			stats.hp += statGrowth.hp;
			stats.mp += statGrowth.mp;
			stats.Strength += statGrowth.Strength;
			stats.Dexterity += statGrowth.Dexterity;
			stats.Constitution += statGrowth.Constitution;
			stats.Intelligence += statGrowth.Intelligence;
			user.baseStats = JSON.stringify(stats);
			user.save();

			message.reply(`you have leveled up to level ${user.level}.
			You gain the following stat increases:
			**${statGrowth.maxHP}** HP
			**${statGrowth.maxMP}** MP
			**${statGrowth.Strength}** Strength
			**${statGrowth.Dexterity}** Dexterity
			**${statGrowth.Constitution}** Constitution
			**${statGrowth.Intelligence}** Intelligence
			`);
		}

		return {
			level: user.level,
			exp: user.exp,
			expNeeded: expNeeded,
		};
	},
});

























// ITEMS
Reflect.defineProperty(characterCommands, 'addItem', {
	value: async function addItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});

		user.networth += item.value * parseInt(amount);
		user.save();

		if (userItem) {
			userItem.amount += parseInt(amount);
			return userItem.save();
		}

		return UserItems.create({
			user_id: user.user_id,
			name: item.name,
			amount: parseInt(amount),
		});
	},
});
Reflect.defineProperty(characterCommands, 'removeItem', {
	value: async function removeItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});

		const removeAmount = parseInt(amount);

		if (userItem.amount >= removeAmount) {
			user.networth -= item.value * removeAmount;
			if (item.ctg == 'equipment' && userItem.amount - removeAmount == 0) {
				const equipment = JSON.parse(user.equipment);
				if (equipment[item.slot] == item.name) equipment[item.slot] = null;
				user.equipment = JSON.stringify(equipment);
			}

			if (userItem.amount == removeAmount) userItem.destroy();
			else userItem.amount -= removeAmount;
			return userItem.save();
		}

		throw Error(`User doesn't have the item: ${item.name}`);
	},
});

Reflect.defineProperty(characterCommands, 'hasItem', {
	value: async function hasItem(user, item, amount = 1) {
		const userItem = await UserItems.findOne({
			where: { user_id: user.user_id, name: item.name },
		});
		const check = parseInt(amount);
		if (userItem.amount >= check && check > 0) return true;
		return false;
	},
});

Reflect.defineProperty(characterCommands, 'getInventory', {
	value: async function getInventory(user) {
		return UserItems.findAll({
			where: { user_id: user.user_id },
		});
	},
});
Reflect.defineProperty(characterCommands, 'getItem', {
	value: function getItem(itemName) {
		const item = itemName.toLowerCase();
		if (items[item]) return items[item];
		return false;
	},
});
































// Misc
Reflect.defineProperty(characterCommands, 'getUser', {
	value: async function getUser(id) {
		let user = characterCommands.get(id);
		if (!user) user = await characterCommands.newUser(id);
		return user;
	},
});

Reflect.defineProperty(characterCommands, 'addMoney', {
	value: function addMoney(user, amount) {
		if (isNaN(amount)) throw Error(`${amount} is not a valid number.`);
		user.balance += Number(amount);
		if (amount > 0) user.totalEarned += Number(amount);

		user.save();
		return Math.floor(user.balance);
	},
});


Reflect.defineProperty(characterCommands, 'calculateIncome', {
	value: async function calculateIncome(user) {
		const uItems = await characterCommands.getInventory(user);
		let networth = 0;
		let income = 0;
		let daily = 0;
		let hourly = 0;

		if (uItems.length) {
			uItems.map(i => {
				if (i.amount < 1) return;
				const item = items[i.name.toLowerCase()];
				networth += item.value * i.amount;
				if (item.ctg == 'collectable') {
					income += Math.pow((item.value * 149) / 1650, 1.1) * i.amount;
					daily += Math.pow(item.value / 100, 1.1) * i.amount;
					hourly += Math.pow(item.value / 400, 1.1) * i.amount;
				}
			});
		}
		return { networth: networth, income: income, daily: daily, hourly: hourly };
	},
});




// COOLDOWNS
Reflect.defineProperty(characterCommands, 'getDaily', {
	value: function getDaily(user) {
		const now = moment();
		const dCheck = moment(user.lastDaily).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(characterCommands, 'setDaily', {
	value: function setDaily(user) {
		user.lastDaily = moment().toString();
		return user.save();
	},
});

Reflect.defineProperty(characterCommands, 'getHourly', {
	value: function getHourly(user) {
		const now = moment();
		const hCheck = moment(user.lastHourly).add(1, 'h');
		if (moment(hCheck).isBefore(now)) return true;
		else return hCheck.format('MMM Do HH:mm');
	},
});
Reflect.defineProperty(characterCommands, 'setHourly', {
	value: function setHourly(user) {
		user.lastHourly = moment().toString();
		return user.save();
	},
});


Reflect.defineProperty(characterCommands, 'setVote', {
	value: function setVote(user) {
		user.lastVote = moment().toString();
		return user.save();
	},
});
Reflect.defineProperty(characterCommands, 'getVote', {
	value: function getVote(user) {
		const now = moment();
		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('MMM Do HH:mm');
	},
});


Reflect.defineProperty(characterCommands, 'getColour', {
	value: function getColour(user) {
		if (user.class) {
			const userClass = characterCommands.getClass(user.class);
			return userClass.colour;
		}
		return '#fcfcfc';
	},
});

module.exports = { Users, characterCommands };