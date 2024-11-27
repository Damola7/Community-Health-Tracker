const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db'); // Import database connection
const router = express.Router(); // Create an Express Router

// Route for user registration
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)';
    
    db.query(query, [first_name, last_name, email, hashedPassword], (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Error creating account' });
        }
        res.json({ success: true });
    });
});

// Route for user login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        req.session.userId = user.id; // Store user ID in session
        res.json({ success: true });
    });
});

// Route for fetching health metrics
router.get('/get-health-metrics', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const query = 'SELECT * FROM health_metrics WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching health metrics' });
        }
        res.json(results);
    });
});

// Route for deleting the user account
router.post('/delete-account', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    db.query('DELETE FROM health_metrics WHERE user_id = ?', [userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error deleting health metrics' });

        db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
            if (err) return res.status(500).json({ message: 'Error deleting user' });

            req.session.destroy(() => {
                res.json({ success: true });
            });
        });
    });
});

// Route for logging out
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('login.html'); // Redirect to login page after successful logout
    });
});

module.exports = router; // Export the router to use in app.js
