const { Router } = require("express");
const MemberRepository = require("../repositorys/member.repository");
const { Member } = require("../models");
const router = Router();
const jwt = require('jsonwebtoken');
const memberRepository = new MemberRepository(Member);

/* api/login/info */
router.get('/login/info', (req, res) => {
    const userId = req.user.id;

    return res.status(200).json({ 
        id: userId
    });
});

/* api/login */
router.post('/login', async (req, res) => {
    const {email, password} = req.body

    const member = await memberRepository.findByEmail(email);
    if(member === null || member.email !== email || member.password !== password) {
        return res.status(401).json({ 
            message: "로그인 정보가 올바르지 않습니다."
        });
    }
    const tokenPayload = {
        id: member.id
    };

    const secretKey = process.env.JWT_SECRET; 
    
    const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '1h' });

    res.cookie('access_token', token, {
        httpOnly: true,
        maxAge: 3600000,
        path: '/',
        sameSite: 'Lax'
    });

    return res.redirect('/');
});

module.exports = router;