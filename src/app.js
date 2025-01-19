const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const breakRoutes = require('./routes/breaks');

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/breaks', breakRoutes);

// Catch-all for serving the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
