const Database = require('better-sqlite3');
const path = require('path');

const applySchema = require('./schema');
const seed = require('./seed');

const dbPath = path.join(__dirname, 'app.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

applySchema(db);


if (process.env.NODE_ENV !== 'production') {
  seed(db);
}

module.exports = db;
