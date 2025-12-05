const migrate = require('./utils/migrate');
const { pool } = require('./config/db');

console.log("Running migrations manually...");
migrate().then(() => {
    console.log('Migration run complete.');
    pool.end();
}).catch(err => {
    console.error("Migration run failed:", err);
    pool.end();
});
