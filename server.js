const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files

// Endpoint to save location for housing ad
app.post('/save-location', (req, res) => {
    const { latitude, longitude, address, timestamp } = req.body;
    const logEntry = `${timestamp}, ${latitude}, ${longitude}, ${address}\n`;

    fs.appendFile(path.join(__dirname, 'locations.txt'), logEntry, (err) => {
        if (err) {
            console.error('Error saving location:', err);
            return res.status(500).send('Error saving location');
        }
        res.send('Location saved successfully');
    });
});

// Endpoint to handle house registration data
app.post('/save-registration', (req, res) => {
    const { fullName, address, city, postalCode, country } = req.body;

    const registrationEntry = `${fullName}, ${address}, ${city}, ${postalCode}, ${country}\n`;

    fs.appendFile(path.join(__dirname, 'house-registrations.txt'), registrationEntry, (err) => {
        if (err) {
            console.error('Error saving registration:', err);
            return res.status(500).send('Error saving registration');
        }
        res.json({ success: true });
    });
});

app.get('/locations', (req, res) => {
    fs.readFile('locations.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const locations = data.trim().split('\n').map(line => JSON.parse(line)); // Parse each line as JSON
        res.json(locations);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
