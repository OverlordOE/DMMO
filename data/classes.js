module.exports = {

	warrior: {
		name: 'Warrior',
		colour: '#7d6e33',
		description: 'The warrior uses its overwhelming strength to crush any enemies in its path.\nThis class is mainly focused on strength and melee weapons.',
		stats: {
			base: {
				maxHP: 44,
				maxMP: 36,
				Strength: 24,
				Dexterity: 18,
				Constitution: 23,
				Intelligence: 17,
			},
			growth: {
				maxHP: 13,
				maxMP: 8,
				Strength: 7,
				Dexterity: 4,
				Constitution: 6,
				Intelligence: 4,
			},
		},
		startSkills: ['slash', 'shield'],
		startEquipment: ['training sword', 'training shield'],
	},

	ranger: {
		name: 'Ranger',
		colour: '#28a85c',
		description: 'The ranger prefers to fight from a distance with a bow.\nThis class is mainly focused on dexterity.',
		stats: {
			base: {
				maxHP: 39,
				maxMP: 41,
				Strength: 19,
				Dexterity: 24,
				Constitution: 19,
				Intelligence: 20,
			},
			growth: {
				maxHP: 10,
				maxMP: 11,
				Strength: 5,
				Dexterity: 7,
				Constitution: 4,
				Intelligence: 5,
			},
		},
		startSkills: ['slash', 'shield'],
		startEquipment: ['training sword'],
	},

	wizard: {
		name: 'Wizard',
		colour: '#c515e8',
		description: 'The wizard is a master of the arcane and uses spells too annihilate the enemy.\nThis class is mainly focused on Intelligence.',
		stats: {
			base: {
				maxHP: 36,
				maxMP: 44,
				Strength: 18,
				Dexterity: 21,
				Constitution: 19,
				Intelligence: 24,
			},
			growth: {
				maxHP: 8,
				maxMP: 13,
				Strength: 4,
				Dexterity: 5,
				Constitution: 5,
				Intelligence: 7,
			},
		},
		startSkills: ['slash', 'shield'],
		startEquipment: ['training staff'],
	},


};