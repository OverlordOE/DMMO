const Sequelize = require('sequelize');

// Initialize new DB
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// Import tables
sequelize.import('models/Users');
sequelize.import('models/UserItems');
sequelize.import('models/Guilds');

sequelize
	.sync({ force: true })
	.then(async () => {
		console.log('DB synced');
		sequelize.close();
	})
	.catch(console.error);