require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const path = require('path');
const session = require('express-session');
const routes = require('./routes'); // Import the routes file

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup using the session secret from the .env file
app.use(session({
    secret: process.env.SESSION_SECRET, // Use the session secret from the .env file
    resave: false,
    saveUninitialized: true
}));

// Use the routes from routes.js
app.use('/', routes); // Use the routes for all paths

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
