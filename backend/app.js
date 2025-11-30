/* 환경 변수 로드 백엔드 기준 root 경로의 env */
const express = require('express')
const path = require('path');
const app = express()
const port = 3000

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// DB 연결
const dbPool = require('./conf/db');

/* live server cors 열어두기 */
const cors = require('cors');
const models = require('./models');
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions))
/* 요청 json으로 파싱 */
app.use(express.json());

/* backend 호출 */ 
app.use('/api', require('./routes/fetch-api.route'));
app.use('/api', require('./routes/test.route'));
/* frontend 폴더 기준으로 서빙 */
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// db 연결 성공 시에만 서버 시작
dbPool.query('SELECT 1', (err) => {
    if (err) {
        console.error('DB 연결 실패!', err.stack);
    } else {
        console.log('DB 연결 풀 준비 완료.');
        models.initializeDatabase();
        app.listen(port, () => console.log(`${port} 포트에서 서버 열림`))
    }
});