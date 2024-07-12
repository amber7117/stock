const functions = require('firebase-functions');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware for serving static files
app.use(express.static(path.join(__dirname, 'ot')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'images');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        res.json(imageFiles);
    });
});

// Expose Express API as a single Cloud Function
exports.app = functions.https.onRequest(app);

