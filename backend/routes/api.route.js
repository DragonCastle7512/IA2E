const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/* backend/controllers */
const CONTROLLER_PATH = path.join(__dirname, '..', 'controllers');

/* controllers의 모든 파일 로드 */
try {
    const files = fs.readdirSync(CONTROLLER_PATH);

    files.forEach(file => {
        if (file.endsWith('.js')) {
            const fullPath = path.join(CONTROLLER_PATH, file);
            router.use('/', require(fullPath));
        }
    });

} catch (err) {
    console.error(err);
}


module.exports = router;