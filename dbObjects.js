const Sequelize = require('sequelize');
const moment = require('moment');
const Discord = require('discord.js');
const fs = require('fs');
const profile = new Discord.Collection();
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

const itemData = fs.readFileSync('data/items.json');
const items = JSON.parse(itemData);


// ITEMS
Reflect.defineProperty(profile, 'addItem', {
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
			base: item,
			name: item.name,
			amount: parseInt(amount),
		});
	},
});
Reflect.defineProperty(profile, 'removeItem', {
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


Reflect.defineProperty(profile, 'getInventory', {
	value: async function getInventory(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return UserItems.findAll({
			where: { user_id: id },
		});
	},
});


Reflect.defineProperty(profile, 'getItem', {
	value: function getItem(item) {
		for (let i = 0; i < items.length; i++) if (items[i].name.toLowerCase() == item.toLowerCase()) return items[i];
		return false;
	},
});


// USERS
Reflect.defineProperty(profile, 'getUser', {
	value: async function getUser(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user;
	},
});


Reflect.defineProperty(profile, 'resetClass', {
	value: async function resetClass(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		
		user.class = null;
		user.stats = null;
		user.level = 1;
		user.exp = 0;
		
		return user.save();
	},
});


Reflect.defineProperty(profile, 'addMoney', {
	value: async function addMoney(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.balance += Number(amount);
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getBalance', {
	value: async function getBalance(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		return user ? Math.floor(user.balance) : 0;
	},
});


Reflect.defineProperty(profile, 'setClass', {
	value: async function setClass(id, c) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.curHP = c.stats.base.hp;
		user.curMP = c.stats.base.mp;
		user.class = JSON.stringify(c);
		user.stats = JSON.stringify(c.stats.base);
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getClass', {
	value: async function getClass(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		if (!user.class) return null;
		return user ? JSON.parse(user.class) : null;
	},
});


Reflect.defineProperty(profile, 'getStats', {
	value: async function getStats(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		if (!user.class) return null;
		return user ? JSON.parse(user.stats) : null;
	},
});


Reflect.defineProperty(profile, 'addExp', {
	value: async function addExp(id, amount) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		user.exp += Number(amount);
		user.save();
		return profile.nextLevel(id);
	},
});
Reflect.defineProperty(profile, 'nextLevel', {
	value: async function nextLevel(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const exponent = 1.5;
		const baseExp = 1000;
		let expNeeded = baseExp / 10 * Math.floor(baseExp / 100 * Math.pow(user.level, exponent));
		let levelup = false;

		while (user.exp >= expNeeded && user.level < 60) {
			user.level++;
			user.exp -= expNeeded;
			levelup = true;
			expNeeded = baseExp / 10 * Math.floor(baseExp / 100 * Math.pow(user.level, exponent));
			user.save();
		}
		return {
			level: user.level,
			exp: user.exp,
			expNeeded: expNeeded,
			levelup: levelup,
		};
	},
});


Reflect.defineProperty(profile, 'getDaily', {
	value: async function getDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const dCheck = moment(user.lastDaily).add(1, 'd');
		if (moment(dCheck).isBefore(now)) return true;
		else return dCheck.format('dddd HH:mm');
	},

});
Reflect.defineProperty(profile, 'setDaily', {
	value: async function setDaily(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const currentDay = moment();
		user.lastDaily = currentDay;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'getHourly', {
	value: async function getHourly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const hCheck = moment(user.lastHourly).add(1, 'h');
		if (moment(hCheck).isBefore(now)) return true;
		else return hCheck.format('dddd HH:mm');
	},
});
Reflect.defineProperty(profile, 'setHourly', {
	value: async function setHourly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const day = moment();
		user.lastHourly = day;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'getWeekly', {
	value: async function getWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const wCheck = moment(user.lastWeekly).add(1, 'w');
		if (moment(wCheck).isBefore(now)) return true;
		else return wCheck.format('dddd HH:mm');
	},

});
Reflect.defineProperty(profile, 'setWeekly', {
	value: async function setWeekly(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const day = moment();
		user.lastWeekly = day;
		return user.save();
	},
});


Reflect.defineProperty(profile, 'setVote', {
	value: async function setVote(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);

		const day = moment();
		user.lastVote = day;
		return user.save();
	},
});
Reflect.defineProperty(profile, 'getVote', {
	value: async function getVote(id) {
		let user = profile.get(id);
		if (!user) user = await profile.newUser(id);
		const now = moment();

		const vCheck = moment(user.lastVote).add(12, 'h');
		if (moment(vCheck).isBefore(now)) return true;
		else return vCheck.format('dddd HH:mm');
	},
});


Reflect.defineProperty(profile, 'newUser', {
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
		profile.set(id, user);
		return user;
	},
});

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

module.exports = { Users, Guilds, UserItems, profile, guildProfile };