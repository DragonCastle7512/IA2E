const express = require('express');
const cors = require('cors');

module.exports = (app) => {
    // 1. CORS 설정
    const corsOptions = {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    app.use(cors(corsOptions));

    // 2. 요청 json 파싱 설정
    app.use(express.json());
};