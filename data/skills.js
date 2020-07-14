module.exports = {

	slash: {
		name: 'slash',
		emoji: '⚔️',
		description: '',
		class: 'all',
		type: 'attack',
		manaCost: 0.1,
		damageType: 'physical',
		mult: {
			damage: 0.2,
		},
	},

	shield: {
		name: 'shield',
		emoji: '🛡️',
		description: '',
		class: 'all',
		type: 'debuff',
		manaCost: 0.08,
		damageType: 'physical',
		debuff: {
			damage: -0.5,
		},
	},
};