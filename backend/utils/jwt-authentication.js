const jwt = require('jsonwebtoken');
const MemberRepository = require('../repositorys/member.repository');
const { Member } = require('../models');
const memberRepository = new MemberRepository(Member);

function jwtAuthentication(res, member) {
    const refreshSecret = process.env.REFRESH_SECRET;
    const refreshToken = jwt.sign({ id: member.id }, refreshSecret, { expiresIn: '14d' });
    issuedJwtToken(res, member);
    memberRepository.updateRefreshToken(member.id, refreshToken);

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
        path: '/api/auth/refresh',
        sameSite: 'Lax'
    });
}

function issuedJwtToken(res, member) {
    const secretKey = process.env.JWT_SECRET; 
    const token = jwt.sign({id: member.id}, secretKey, { expiresIn: '1h' });
    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1시간
        path: '/',
        sameSite: 'Lax'
    });
}

module.exports = { jwtAuthentication, issuedJwtToken };