/* 환경 변수 로드 백엔드 기준 root 경로의 env */
require('dotenv').config({ path: '../.env' });

const express = require('express')
const path = require('path');
const app = express()
const port = 3000

/* live server cors 열어두기 */
const cors = require('cors');
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions))
/* 요청 json으로 파싱 */
app.use(express.json());

/* backend 호출 */ 
app.use('/api', require('./routes/fetchAPIRoute'));
/* frontend 폴더 기준으로 서빙 */
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(port, () => console.log(`${port} 포트에서 서버 열림`))