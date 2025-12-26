const jwt = require('jsonwebtoken');

function jwtAuthentication(res, member) {
    const secretKey = process.env.JWT_SECRET; 
    const token = jwt.sign({id: member.id}, secretKey, { expiresIn: '1h' });
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 3600000,
        path: '/',
        sameSite: 'Lax'
    });
}
module.exports = { jwtAuthentication };