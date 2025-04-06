
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from 'public' folder

// Routes
app.post('/submit-contact', (req, res) => {
  console.log('Contact form data:', req.body);
  res.send('Thanks for contacting us!');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);
  // Add authentication logic here
  res.send(`Welcome, ${email}!`);
});

