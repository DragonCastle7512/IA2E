/* 환경 변수 로드 백엔드 기준 root 경로의 env */
const express = require('express')
const path = require('path');
const app = express()
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const port = process.env.PORT

/* DB 연결 */
const models = require('./models');
/* 미들웨어 및 라우터 등록 */
const setupMiddleware = require('./conf/middleware');
const setupRoutes = require('./routes');

app.use(express.static(path.join(__dirname, '..', 'frontend')));
setupMiddleware(app);
setupRoutes(app);

(async () => {
    try {
        await models.initializeDatabase();
        app.listen(port, process.env.MODE ? '0.0.0.0' : null, () => {
            console.log(`${port} 포트에서 서버 열림`);
        });

    } catch (err) {
        console.error('DB 연결 또는 서버 시작 실패!', err);
        process.exit(1);
    }
})();