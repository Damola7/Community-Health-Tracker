require('dotenv').config(); // Load environment variables from .env file

const mysql = require('mysql2');

// Create and configure the MySQL database connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit if connection fails
    } else {
        console.log('Connected to the MySQL database');
    }
});

module.exports = db; // Export the connection to be used elsewhere
