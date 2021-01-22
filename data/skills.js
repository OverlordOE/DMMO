module.exports = {

	slash: {
		name: 'slash',
		emoji: '⚔️',
		description: '',
		class: 'All',
		type: ['attack'],
		manaCost: 0.1,
		damageType: 'physical',
		mult: {
			Damage: 0.2,
		},
	},

	shield: {
		name: 'shield',
		emoji: '🛡️',
		description: '',
		class: 'All',
		type: ['buff'],
		manaCost: 0.08,
		damageType: 'physical',
		debuff: {
			Damage: -0.5,
		},
	},
};