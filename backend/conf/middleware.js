const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    // 1. CORS 설정
    const corsOptions = {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: true }));
    // 2. 요청 json 파싱 설정
    app.use(express.json());
    // 3. Cookie Parser 등록
    app.use(cookieParser())
};