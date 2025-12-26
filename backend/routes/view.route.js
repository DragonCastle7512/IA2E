const express = require('express');
const router = express.Router();
const path = require('path');

/* frontend/ */
const FRONTEND_PATH = path.join(__dirname, '../..', 'frontend');

/* / -> index.html */
router.get('/', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

/* /login -> login/login.html */
router.get('/login', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'login', 'login.html'));
});

/* /signup -> login/signup.html */
router.get('/signup', (req, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'login', 'signup.html')); 
});

module.exports = router;