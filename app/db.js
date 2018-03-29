const mongoist = require('mongoist');
var connectionString = process.env.MONGOIST_KEY;
const db = mongoist(connectionString);

module.exports = db;
