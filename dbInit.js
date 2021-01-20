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


// Execute node dbInit.js --force or node dbInit.js -f to force update the tables (this resets the db but removes unused tables).
// Execute node dbInit.js --sync or node dbInit.js -s to force update the tables (this doesnt reset the db but keeps unused tables).

// Create tags
sequelize
	.sync({ force: true })
	.then(async () => {
		console.log('DB synced');
		sequelize.close();
	})
	.catch(console.error);
