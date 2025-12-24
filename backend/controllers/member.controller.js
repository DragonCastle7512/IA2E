const { Router } = require("express");
const MemberRepository = require("../repositorys/member.repository");
const { Member } = require("../models");
const router = Router();
const jwt = require('jsonwebtoken');
const passport = require("passport");
const memberRepository = new MemberRepository(Member);

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

/* api/login/info */
router.get('/login/info', (req, res) => {
    const userId = req.user.id;

    return res.status(200).json({ 
        id: userId
    });
});

/* api/login */
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const member = await memberRepository.findByEmail(email);
    if(member === null || member.email !== email || member.password !== password) {
        return res.status(401).json({ 
            message: "로그인 정보가 올바르지 않습니다."
        });
    }
    jwtAuthentication(res, member);

    return res.redirect('/');
});

/* api/signup */
router.post('/signup', async (req, res) => {
    const r = req.body;
    const data = {
	    email: r.email,
        password: r.password
	};
    const response = await memberRepository.createMember(data);
    res.status(201).json(response);
});

/* api/auth/google */
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

/* api/auth/google/callback */
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    async (req, res) => {
        // 구글 oauth에서 req.user에 담아서 보냄
        jwtAuthentication(res, req.user);
        res.redirect('/');
    }
);

module.exports = router;