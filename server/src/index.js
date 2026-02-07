const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();




const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'tailor_master_key';

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// File paths
const DATA_DIR = path.join(__dirname, '../data');
const ITEMS_FILE = path.join(DATA_DIR, 'items.json');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');
const JOURNEY_FILE = path.join(DATA_DIR, 'journey.json');
const CONTACT_FILE = path.join(DATA_DIR, 'contact.json');

// In-memory storage for login attempts
const loginAttempts = new Map(); // { ip: { count, resetAt } }

// Helpers
const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 100, // 100 requests
    message: 'Too many login attempts.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Auth Middleware
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token.split(' ')[1], SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Get client IP
const getClientIP = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        'Unknown';
};

// Check login attempts
const checkLoginAttempts = (ip) => {
    const attempt = loginAttempts.get(ip);
    if (!attempt) return { allowed: true, remaining: 3 };

    // Reset if time window passed
    if (Date.now() > attempt.resetAt) {
        loginAttempts.delete(ip);
        return { allowed: true, remaining: 3 };
    }

    if (attempt.count >= 100) { // Increased max attempts
        const waitTime = Math.ceil((attempt.resetAt - Date.now()) / 1000);
        return {
            allowed: false,
            remaining: 0,
            message: `Too many failed attempts. Try again in ${waitTime} seconds.`
        };
    }

    return { allowed: true, remaining: 100 - attempt.count };
};

// Record failed attempt
const recordFailedAttempt = (ip) => {
    const attempt = loginAttempts.get(ip);
    if (!attempt) {
        loginAttempts.set(ip, {
            count: 1,
            resetAt: Date.now() + 1000 // 1 second reset
        });
        return 1;
    }

    attempt.count++;
    return attempt.count;
};

// Clear login attempts
const clearLoginAttempts = (ip) => {
    loginAttempts.delete(ip);
};

// --- Auth Routes ---

// Login with username/password
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const clientIP = getClientIP(req);

    // Check login attempts
    const attemptCheck = checkLoginAttempts(clientIP);
    if (!attemptCheck.allowed) {
        return res.status(429).json({
            success: false,
            message: attemptCheck.message,
            attemptsLeft: 0
        });
    }

    // Verify credentials
    // Allow login if username matches ADMIN_USERNAME or ADMIN_EMAIL
    const validUsername = (username === process.env.ADMIN_USERNAME) || (username === process.env.ADMIN_EMAIL);
    const validPassword = password === process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
        const failedCount = recordFailedAttempt(clientIP);

        return res.status(401).json({
            success: false,
            message: `Invalid credentials.`,
            attemptsLeft: 100
        });
    }

    // Login successful
    clearLoginAttempts(clientIP);

    // Generate JWT token
    const token = jwt.sign(
        { username: process.env.ADMIN_USERNAME },
        SECRET_KEY,
        { expiresIn: '24h' }
    );

    res.json({
        success: true,
        message: 'Login successful! Welcome back.',
        token
    });
});

// --- Items API ---
app.get('/api/items', (req, res) => res.json(readJSON(ITEMS_FILE)));
app.post('/api/items', authenticate, (req, res) => {
    const items = readJSON(ITEMS_FILE);
    let newItem = { ...req.body };
    if (req.files && req.files.image) {
        const file = req.files.image;
        const fileName = `${Date.now()}_${file.name}`;
        file.mv(path.join(__dirname, '../uploads', fileName), (err) => {
            if (err) return res.status(500).send(err);
            newItem.src = `/uploads/${fileName}`;
            items.push(newItem);
            writeJSON(ITEMS_FILE, items);
            res.status(201).json(newItem);
        });
    } else {
        items.push(newItem);
        writeJSON(ITEMS_FILE, items);
        res.status(201).json(newItem);
    }
});
app.delete('/api/items/:index', authenticate, (req, res) => {
    const items = readJSON(ITEMS_FILE);
    items.splice(req.params.index, 1);
    writeJSON(ITEMS_FILE, items);
    res.sendStatus(204);
});

// --- Reviews API ---
app.get('/api/reviews', (req, res) => res.json(readJSON(REVIEWS_FILE)));
app.post('/api/reviews', authenticate, (req, res) => {
    const reviews = readJSON(REVIEWS_FILE);
    reviews.push(req.body);
    writeJSON(REVIEWS_FILE, reviews);
    res.status(201).json(req.body);
});
app.delete('/api/reviews/:index', authenticate, (req, res) => {
    const reviews = readJSON(REVIEWS_FILE);
    reviews.splice(req.params.index, 1);
    writeJSON(REVIEWS_FILE, reviews);
    res.sendStatus(204);
});

// --- Services API ---
app.get('/api/services', (req, res) => res.json(readJSON(SERVICES_FILE)));
app.post('/api/services', authenticate, (req, res) => {
    const services = readJSON(SERVICES_FILE);
    services.push(req.body);
    writeJSON(SERVICES_FILE, services);
    res.status(201).json(req.body);
});
app.delete('/api/services/:index', authenticate, (req, res) => {
    const services = readJSON(SERVICES_FILE);
    services.splice(req.params.index, 1);
    writeJSON(SERVICES_FILE, services);
    res.sendStatus(204);
});

// --- Journey API ---
app.get('/api/journey', (req, res) => res.json(readJSON(JOURNEY_FILE)));
app.post('/api/journey', authenticate, (req, res) => {
    const journey = readJSON(JOURNEY_FILE);
    journey.push(req.body);
    writeJSON(JOURNEY_FILE, journey);
    res.status(201).json(req.body);
});
app.delete('/api/journey/:index', authenticate, (req, res) => {
    const journey = readJSON(JOURNEY_FILE);
    journey.splice(req.params.index, 1);
    writeJSON(JOURNEY_FILE, journey);
    res.sendStatus(204);
});

// --- Contact API ---
app.get('/api/contact', (req, res) => res.json(readJSON(CONTACT_FILE)));
app.post('/api/contact', authenticate, (req, res) => {
    writeJSON(CONTACT_FILE, req.body);
    res.json(req.body);
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Admin Email: ${process.env.ADMIN_EMAIL || 'Not configured'}`);
    console.log(`🔐 Admin Access: Ready\n`);
});
