/* 환경 변수 로드 백엔드 기준 root 경로의 env */
const express = require('express')
const path = require('path');
const app = express()
const port = 3000

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

/* DB 연결 */
const dbPool = require('./conf/db');
const models = require('./models');

const setupMiddleware = require('./conf/middleware');
setupMiddleware(app);

app.use(express.static(path.join(__dirname, '..', 'frontend')));

const setupRoutes = require('./routes');
setupRoutes(app);

dbPool.query('SELECT 1', (err) => {
    if (err) {
        console.error('DB 연결 실패!', err.stack);
    } else {
        console.log('DB 연결 풀 준비 완료.');
        models.initializeDatabase();
        app.listen(port, () => console.log(`${port} 포트에서 서버 열림`))
    }
});