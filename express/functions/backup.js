const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/images', express.static('images'));

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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

