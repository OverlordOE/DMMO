module.exports = {

	/*	common_chest: {
			name: 'common_chest',
			value: 50,
			emoji: '<:CommonBox:727513141260583031>',
			rarity: 'common',
			picture: 'common_closed.png',
			type: 'chests',
			description: 'Common Chest.',
		},
		rare_chest:
		{
			name: 'Rare_Chest',
			value: 300,
			emoji: '<:RareBox:727513141243805776>',
			rarity: 'rare',
			picture: 'rare_closed.png',
			type: 'chests',
			description: 'Rare Chest.',
		},
	{
		name: 'Epic Chest',
			value: 1400,
				emoji: '<:EpicBox:727513140849410090>',
					rarity: 'epic',
						picture: 'epic_closed.png',
							type: 'chests',
								description: 'Epic Chest.',
		},
	{
		name: 'Legendary Chest',
			value: 8000,
				emoji: '<:LegendaryBox:727513140836827247>',
					rarity: 'legendary',
						picture: 'legendary_closed.png',
							type: 'chests',
								description: 'Legendary Chest.',
		},*/

	// POTIONS
	lesser_mana_potion: {
		name: 'lesser_mana_potion',
		value: 100,
		buyable: true,
		emoji: '<:Lessermanapotion:727508079578710178>',
		rarity: 'uncommon',
		picture: 'lmp.png',
		type: ['consumable', 'potion'],
		description: 'Restores 20 MP',
		use: function(user) {
			const mp = JSON.parse(user.baseStats).mp;
			if (user.curMP == mp) { return { succes: false, message: 'you are already at max mp' }; }
			else if (user.curMP < 20) {
				const heal = mp - user.curMP;
				user.curMP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:mana:730849477640061029>.\nCurrent <:mana:730849477640061029> is **${user.curMP}/${mp}<:mana:730849477640061029>**.` };
			}
			else {
				const heal = 20;
				user.curMP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:mana:730849477640061029>.\nCurrent <:mana:730849477640061029> is **${user.curMP}/${mp}<:mana:730849477640061029>**.` };
			}
		},
	},
	mana_potion: {
		name: 'mana_potion',
		value: 200,
		buyable: true,
		emoji: '<:Manapotion:727508079469396028>',
		rarity: 'rare',
		picture: 'mp.png',
		type: ['consumable', 'potion'],
		description: 'Restores 50 MP',
		use: function(user) {
			const mp = JSON.parse(user.baseStats).mp;
			if (user.curMP == mp) { return { succes: false, message: 'you are already at max mp' }; }
			else if (user.curMP < 50) {
				const heal = mp - user.curMP;
				user.curMP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:mana:730849477640061029>.\nCurrent <:mana:730849477640061029> is **${user.curMP}/${mp}<:mana:730849477640061029>**.` };
			}
			else {
				const heal = 50;
				user.curMP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:mana:730849477640061029>.\nCurrent <:mana:730849477640061029> is **${user.curMP}/${mp}<:mana:730849477640061029>**.` };
			}
		},
	},
	greater_mana_potion: {
		name: 'greater_mana_potion',
		value: 650,
		buyable: true,
		emoji: '<:Greatermanapotion:727508080316907561>',
		rarity: 'epic',
		picture: 'gmp.png',
		type: ['consumable', 'potion'],
		description: 'Restores 150 MP',
		use: function(user) {
			const mp = JSON.parse(user.baseStats).mp;
			if (user.curMP == mp) { return { succes: false, message: 'you are already at max mp' }; }
			else if (user.curMP < 150) {
				const heal = mp - user.curMP;
				user.curMP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:mana:730849477640061029>.\nCurrent <:mana:730849477640061029> is **${user.curMP}/${mp}<:mana:730849477640061029>**.` };
			}
			else {
				const heal = 150;
				user.curMP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:mana:730849477640061029>.\nCurrent <:mana:730849477640061029> is **${user.curMP}/${mp}<:mana:730849477640061029>**.` };
			}
		},
	},

	lesser_healing_potion: {
		name: 'lesser_healing_potion',
		value: 120,
		buyable: true,
		emoji: '<:Lesserhealingpotion:727508079448686622>',
		rarity: 'uncommon',
		picture: 'lmp.png',
		type: ['consumable', 'potion'],
		description: 'Restores 20 HP',
		use: function(user) {
			const hp = JSON.parse(user.baseStats).hp;
			if (user.curHP == hp) { return { succes: false, message: 'you are already at max hp' }; }
			else if (user.curHP < 20) {
				const heal = hp - user.curHP;
				user.curHP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:health:730849477765890130>.\nCurrent <:health:730849477765890130> is **${user.curHP}/${hp}<:health:730849477765890130>**.` };
			}
			else {
				const heal = 20;
				user.curHP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:health:730849477765890130>.\nCurrent <:health:730849477765890130> is **${user.curHP}/${hp}<:health:730849477765890130>**.` };
			}
		},
	},
	healing_potion: {
		name: 'healing_potion',
		value: 260,
		buyable: true,
		emoji: '<:Healingpotion:727508079498756246>',
		rarity: 'rare',
		picture: 'mp.png',
		type: ['consumable', 'potion'],
		description: 'Restores 50 HP',
		use: function(user) {
			const hp = JSON.parse(user.baseStats).hp;
			if (user.curHP == hp) { return { succes: false, message: 'you are already at max hp' }; }
			else if (user.curHP < 50) {
				const heal = hp - user.curHP;
				user.curHP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:health:730849477765890130>.\nCurrent <:health:730849477765890130> is **${user.curHP}/${hp}<:health:730849477765890130>**.` };
			}
			else {
				const heal = 50;
				user.curHP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:health:730849477765890130>.\nCurrent <:health:730849477765890130> is **${user.curHP}/${hp}<:health:730849477765890130>**.` };
			}
		},
	},
	greater_healing_potion: {
		name: 'greater_healing_potion',
		value: 820,
		buyable: true,
		emoji: '<:GreaterHealingpotion:727508079494692914>',
		rarity: 'epic',
		picture: 'gmp.png',
		type: ['consumable', 'potion'],
		description: 'Restores 150 HP',
		use: function(user) {
			const hp = JSON.parse(user.baseStats).hp;
			if (user.curHP == hp) { return { succes: false, message: 'You are already at max HP' }; }
			else if (user.curHP < 150) {
				const heal = hp - user.curHP;
				user.curHP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:health:730849477765890130>.\nCurrent <:health:730849477765890130> is **${user.curHP}/${hp}<:health:730849477765890130>**.` };
			}
			else {
				const heal = 150;
				user.curHP += heal;
				user.save();
				return { succes: true, message: `You healed **${heal}**<:health:730849477765890130>.\nCurrent <:health:730849477765890130> is **${user.curHP}/${hp}<:health:730849477765890130>**.` };
			}
		},
	},


	// EQUIPMENT
	training_sword: {
		name: 'training_sword',
		value: 60,
		buyable: true,
		emoji: '<:training_sword:735471230932615198>',
		rarity: 'common',
		picture: 'training_sword.png',
		type: ['equipment', 'weapon'],
		slot: 'main hand',
		damage: ['str', 4, 2],
		add: {
			str: 2,
		},
		description: 'Your basic training staff.',
	},

	training_staff: {
		name: 'training_staff',
		value: 60,
		buyable: true,
		emoji: '<:training_staff:735472268616007692>',
		rarity: 'common',
		picture: 'training_staff.png',
		type: ['equipment', 'weapon'],
		slot: 'both hands',
		damage: ['int', 5, 3],
		add: {
			int: 2,
		},
		description: 'Your basic training sword.',
	},


	// MISC
	gun: {
		name: 'gun',
		value: 60,
		buyable: true,
		emoji: '<:gun:727585753818857563>',
		rarity: 'uncommon',
		picture: 'gun.png',
		type: 'consumable',
		description: 'You can use this with the __steal__ command to steal money from other users.',
	},

};