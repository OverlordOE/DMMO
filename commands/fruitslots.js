const Discord = require('discord.js');
module.exports = {
	name: 'Fruitslots',
	summary: 'Play a round of Fruit Slots',
	description: 'Play a round of Fruit Slots. Horizontal rows and vertical rows only.',
	category: 'gambling',
	aliases: ['slots', 'fruit', 'fruits', 'slot'],
	args: true,
	usage: '<gamble amount>',
	example: '100',

	async execute(message, args, msgUser, msgGuild, client, logger) {
		/* 
		Profitability formula: y(1) = x*a*c / b^3
		y = avarage profit per spin in decimal percentage
		x = payout multiplier
		a = amount of proftitable rows per row
		b = amount of symbols
		c = amount of rows
		*/
		const payoutRate = 4;
		const icons = ['🍓', '🍉', '🍒', '🍌', '🍋', '<:luckyseven:838417718944333884>'];
		const slots = [];
		const slotX = 3;
		const slotY = 3;
		let gambleAmount = 0;
		let output = '';
		let count = 0;
		let rowsWon = 0;

		const embed = new Discord.MessageEmbed()
			.setColor('#f3ab16')
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTitle('Neia\'s Gambling Imporium')
			.setFooter('Use the emojis to play the game.', client.user.displayAvatarURL({ dynamic: true }));


		for (let i = 0; i < args.length; i++) {
			if (!isNaN(parseInt(args[i]))) gambleAmount = parseInt(args[i]);
			else if (args[i] == 'all') gambleAmount = Math.floor(msgUser.balance);
		}

		if (gambleAmount < 1) gambleAmount = 1;
		if (gambleAmount > msgUser.balance) return message.channel.send(embed.setDescription(`Sorry *${message.author}*, you only have ${client.util.formatNumber(msgUser.balance)}💰.`));

		client.characterCommands.addBalance(msgUser, -gambleAmount, true);

		output += `
		You have bet ${client.util.formatNumber(gambleAmount)}💰.
		Get **${slotX}** of the __**same symbol**__ in a row to **win**.
		Getting a <:luckyseven:838417718944333884> row will give **3X payout**.\n
		`;

		for (let i = 0; i < slotY; i++) {
			slots[i] = [];
			for (let j = 0; j < slotX; j++) {
				const slotIcon = icons[Math.floor(Math.random() * icons.length)];
				slots[i][j] = slotIcon;
			}
		}
		const sentMessage = await message.channel.send(embed.setDescription(output));
		setEmbed();

		function checkHorizontalWins() {
			if (slots[count].every((val, g, arr) => val === arr[0])) checkWinType(count, 0);
			else output += '❌';
		}

		function checkVerticalWins() {
			for (let i = 0; i < slotX; i++) {
				let win = true;
				const tempIcon = slots[0][i];

				for (let j = 0; j < slotY; j++)
					if (slots[j][i] != tempIcon) win = false;

				if (win) checkWinType(0, i);
				else output += '❌';
			}
		}

		function checkDiagonalWins() {
			let win = true;
			let tempIcon = slots[0][0];

			for (let i = 0; i < slotY; i++)
				if (slots[i][i] != tempIcon) win = false;

			if (win) checkWinType(0, 0);
			else output += '❌';

			win = true;
			tempIcon = slots[0][slotX - 1];

			for (let i = 0; i < slotX; i++)
				if (slots[i][slotX - i - 1] != tempIcon) win = false;

			if (win) checkWinType(0, slotX - 1);
			else output += '❌';

		}

		function checkWinType(x, y) {
			if (slots[x][y] == '<:luckyseven:838417718944333884>') {
				rowsWon += 2;
				output += '⭐';
			}
			else {
				rowsWon++;
				output += '✅';
			}
		}

		function endGame() {
			if (rowsWon >= 1) {
				const winAmount = gambleAmount * payoutRate * rowsWon;
				const balance = client.characterCommands.addBalance(msgUser, winAmount, true);
				output += `\n\n__**You won!**__ **${rowsWon}** row(s)!\nYou gained ${client.util.formatNumber(winAmount)}💰 and your balance is ${client.util.formatNumber(balance)}💰`;
				embed.setColor('#00fc43');
			}
			else {
				embed.setColor('#fc0303');
				output += `\n\n__**You lost!**__ ${client.util.formatNumber(gambleAmount)}💰\nYour balance is ${client.util.formatNumber(msgUser.balance)}💰`;
			}
			sentMessage.edit(embed.setDescription(output));
		}

		function setEmbed() {
			for (let j = 0; j < slots[count].length; j++) output += slots[count][j];

			checkHorizontalWins();
			output += '\n';
			sentMessage.edit(embed.setDescription(output));

			count++;
			if (count < slotY) {
				setTimeout(() => setEmbed(), 1500);
			}
			else {
				checkVerticalWins();
				output += '\n🇽';
				checkDiagonalWins();
				endGame();
			}
		}
	},
};