const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    // 권한 없이 이용가능한 페이지
    const PUBLIC_URLS = [
        '/api/login', 
        '/login', 
        '/api/auth/google',
        '/api/signup'
    ];

    // 하위 경로 전부 허용
    const fullUrl = req.originalUrl.split('?')[0].replace(/\/$/, "");
    
    if (PUBLIC_URLS.some(prefix => fullUrl.startsWith(prefix))) {
        return next();
    }

    const isBackend = fullUrl.startsWith('/api');
    const token = req.cookies.access_token;
    if (!token) {
        if(isBackend) {
            return res.status(401).json({ message: '인증 정보가 없습니다' });
        }
        return res.redirect('/login');
    }

    const secretKey = process.env.JWT_SECRET; 

    try {
        const decoded = jwt.verify(token, secretKey); 
        req.user = { 
            id: decoded.id
        }; 
        next();

    } catch (err) {
        return isBackend ? res.status(403).json({ message: '유효하지 않은 토큰입니다' }) : res.redirect('/login');
    }
};

module.exports = authenticateToken;