const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const PUBLIC_URLS = ['/api/login', '/login', '/login/'];

    const fullUrl = req.path;
    
    if (PUBLIC_URLS.includes(fullUrl)) {
        return next();
    }
    
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message: '인증 정보가 없습니다' });
    }

    const secretKey = process.env.JWT_SECRET; 

    try {
        const decoded = jwt.verify(token, secretKey); 
        req.user = { 
            id: decoded.id
        }; 
        next();

    } catch (err) {
        return res.status(403).json({ message: '유효하지 않은 토큰입니다' });
    }
};

module.exports = authenticateToken;