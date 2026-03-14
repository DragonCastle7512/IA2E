const express = require('express');
const path = require('path');
const router = express.Router();

const FRONTEND_PATH = path.join(__dirname, '../..', 'frontend');

router.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({ error: '404 Not Found API' });
    }

    const errorPagePath = path.join(FRONTEND_PATH, 'error', '404.html');
    res.status(404).sendFile(errorPagePath);
});

module.exports = router;