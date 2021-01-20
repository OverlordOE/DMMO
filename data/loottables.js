const LootTable = require('loot-table');

// cost 700
const common = new LootTable();
common.add({ name: 'Rare Chest', amount: [1, 0] }, 10);
common.add({ name: 'Spiky Rock', amount: [1, 0] }, 100);
common.add({ name: 'Scooter', amount: [3, 3] }, 100);
common.add({ name: 'Car', amount: [1, 1] }, 100);
common.add({ name: 'Motorcycle', amount: [1, 1] }, 100);
common.add({ name: 'Sailboat', amount: [1, 0] }, 20);
common.add({ name: 'Motorboat', amount: [1, 0] }, 40);
common.add({ name: 'Wooden Club', amount: [1, 0] }, 100);


// cost 3.5k
const rare = new LootTable();
rare.add({ name: 'Wooden Club', amount: [3, 1] }, 100);
rare.add({ name: 'Common Chest', amount: [4, 2] }, 50);
rare.add({ name: 'Gun', amount: [1, 0] }, 30);
rare.add({ name: 'Bronze Buckler', amount: [1, 0] }, 30);
rare.add({ name: 'Motorcycle', amount: [7, 3] }, 100);
rare.add({ name: 'Car', amount: [4, 2] }, 100);
rare.add({ name: 'Sailboat', amount: [1, 1] }, 100);
rare.add({ name: 'Motorboat', amount: [3, 1] }, 100);
rare.add({ name: 'Prop plane', amount: [1, 1] }, 100);
rare.add({ name: 'Ship', amount: [1, 0] }, 100);
rare.add({ name: 'Jet plane', amount: [1, 0] }, 30);
rare.add({ name: 'Shortbow', amount: [1, 0] }, 60);
rare.add({ name: 'Bronze Buckler', amount: [1, 0] }, 35);
rare.add({ name: 'Training Shield', amount: [1, 0] }, 100);
rare.add({ name: 'Training Sword', amount: [1, 1] }, 100);
rare.add({ name: 'Training Staff', amount: [1, 0] }, 100);


// cost 14k
const epic = new LootTable();
epic.add({ name: 'Rare Chest', amount: [3, 2] }, 50);
epic.add({ name: 'Shortbow', amount: [3, 0] }, 100);
epic.add({ name: 'Bronze Buckler', amount: [2, 0] }, 100);
epic.add({ name: 'Water', amount: [1, 0] }, 70);
epic.add({ name: 'Enchanted Waraxe', amount: [1, 0] }, 100);
epic.add({ name: 'Obsidian Shield', amount: [1, 0] }, 100);
epic.add({ name: 'Sailboat', amount: [5, 4] }, 100);
epic.add({ name: 'Training Sword', amount: [4, 1] }, 100);
epic.add({ name: 'Training Staff', amount: [4, 1] }, 100);
epic.add({ name: 'Gun', amount: [2, 0] }, 100);
epic.add({ name: 'Gun', amount: [2, 1] }, 50);
epic.add({ name: 'Motorboat', amount: [9, 4] }, 100);
epic.add({ name: 'Ship', amount: [2, 1] }, 50);
epic.add({ name: 'Jet Plane', amount: [2, 0] }, 100);
epic.add({ name: 'Prop Plane', amount: [3, 3] }, 100);
rare.add({ name: 'Bronze Buckler', amount: [2, 0] }, 100);
epic.add({ name: 'House', amount: [1, 0] }, 100);
epic.add({ name: 'Star', amount: [1, 0] }, 40);
epic.add({ name: 'Museum', amount: [1, 0] }, 25);
epic.add({ name: 'Star', amount: [1, 0] }, 15);
epic.add({ name: 'Rijkszwaard', amount: [1, 0] }, 5);
epic.add({ name: 'Office', amount: [1, 0] }, 3);


// cost 50k
const legendary = new LootTable();
legendary.add({ name: 'Rijkszwaard', amount: [1, 0] }, 100);
legendary.add({ name: 'Steinturm', amount: [1, 0] }, 100);
legendary.add({ name: 'Star', amount: [1, 0] }, 40);
legendary.add({ name: 'Star', amount: [2, 0] }, 70);
legendary.add({ name: 'Office', amount: [1, 0] }, 100);
legendary.add({ name: 'Castle', amount: [1, 0] }, 90);
legendary.add({ name: 'Stadium', amount: [1, 0] }, 30);
legendary.add({ name: 'Epic Chest', amount: [3, 1] }, 50);
legendary.add({ name: 'Water', amount: [2, 1] }, 100);
legendary.add({ name: 'Jet Plane', amount: [5, 1] }, 100);
legendary.add({ name: 'House', amount: [3, 0] }, 100);
legendary.add({ name: 'House', amount: [3, 1] }, 50);
legendary.add({ name: 'Museum', amount: [2, 0] }, 100);
legendary.add({ name: 'Museum', amount: [2, 1] }, 20);


// cost 5k
const mystery = new LootTable();
mystery.add({ name: 'Epic Chest', amount: [1, 0] }, 80);
mystery.add({ name: 'Rare Chest', amount: [1, 0] }, 100);
mystery.add({ name: 'House', amount: [1, 0] }, 100);
mystery.add({ name: 'Car', amount: [1, 0] }, 100);
mystery.add({ name: 'Jet Plane', amount: [1, 0] }, 100);
mystery.add({ name: 'Prop Plane', amount: [1, 0] }, 100);
mystery.add({ name: 'Sailboat', amount: [1, 0] }, 100);
mystery.add({ name: 'Museum', amount: [1, 0] }, 40);
mystery.add({ name: 'Motorcycle', amount: [1, 0] }, 40);
mystery.add({ name: 'Ship', amount: [1, 0] }, 100);
mystery.add({ name: 'Sailboat', amount: [2, 0] }, 100);
mystery.add({ name: 'Motorboat', amount: [1, 0] }, 100);

module.exports = {
	common() {
		return common.choose();
	},
	rare() {
		return rare.choose();
	},
	epic() {
		return epic.choose();
	},
	legendary() {
		return legendary.choose();
	},
	mystery() {
		return mystery.choose();
	},
};