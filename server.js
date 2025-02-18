require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const validUrl = require('valid-url');
const { nanoid } = require('nanoid');
const cors = require('cors');
const path = require('path');
const Url = require('./models/url');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// MongoDB Connection
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        throw err;
    }
};

// API Routes

// Create short URL
app.post('/api/shorten', async (req, res) => {
    await connectToDatabase();
    const { longUrl } = req.body;
    
    console.log('Received request to shorten URL:', longUrl);
    
    // Check if the URL is valid
    if (!validUrl.isUri(longUrl)) {
        console.log('Invalid URL received:', longUrl);
        return res.status(400).json({ error: 'Invalid URL' });
    }

    try {
        // Check if URL already exists
        let url = await Url.findOne({ longUrl });
        if (url) {
            console.log('Existing URL found:', url);
            return res.json(url);
        }

        // Create URL code and short URL
        const urlCode = nanoid(8);
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        const shortUrl = `${baseUrl}/${urlCode}`;

        // Create new URL document
        url = new Url({
            longUrl,
            shortUrl,
            urlCode,
        });

        await url.save();
        console.log('New URL created:', url);
        res.json(url);
    } catch (err) {
        console.error('Error in /api/shorten:', err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Redirect to long URL
app.get('/:code', async (req, res) => {
    await connectToDatabase();
    try {
        const url = await Url.findOne({ urlCode: req.params.code });
        if (url) {
            // Increment clicks
            url.clicks += 1;
            await url.save();
            return res.redirect(url.longUrl);
        }
        return res.status(404).json({ error: 'URL not found' });
    } catch (err) {
        console.error('Error in redirect:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all URLs
app.get('/api/urls', async (req, res) => {
    await connectToDatabase();
    try {
        const urls = await Url.find().sort({ createdAt: -1 });
        console.log('Retrieved URLs count:', urls.length);
        res.json(urls);
    } catch (err) {
        console.error('Error in /api/urls:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Only start the server if we're not in a Vercel environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API for Vercel
module.exports = app; 