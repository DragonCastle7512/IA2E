const { Router } = require("express");
const MemberRepository = require("../repositorys/member.repository");
const SettingRepository = require("../repositorys/setting.repository")
const { Member, Setting } = require("../models");
const router = Router();
const passport = require("passport");
const { jwtAuthentication, issuedJwtToken } = require("../utils/jwt-authentication");
const { verifyMails } = require("../utils/mail-sender");
const { compareHash, hash } = require("../utils/bcrypt-encoder");
const memberRepository = new MemberRepository(Member);
const settingRepository = new SettingRepository(Setting);
const jwt = require('jsonwebtoken');

const clearToken = (res) => {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
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
    
    if(member === null || password === '' || member.email !== email || !await compareHash(password, member.password)) {
        return res.status(401).json({ 
            message: "로그인 정보가 올바르지 않습니다."
        });
    }
    jwtAuthentication(res, member);

    return res.status(200).json({message: "로그인 성공"});
});

/* api/logout */
router.delete('/logout', (req, res) => {
    clearToken(res);
    return res.status(200).json({message: '로그아웃 되었습니다'});
});

/* api/signup */
router.post('/signup', async (req, res) => {
    const { email, password, passwordCheck } = req.body;
    if(password !== passwordCheck) {
        return res.status(403).json({message: "두 비밀번호가 일치하지 않습니다"})
    }
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!regex.test(password)) {
        return res.status(403).json({message: "숫자, 영어, 특수문자를 포함하여 8글자 이상 작성해주세요"})
    }
    if(!verifyMails.has(email)) {
        return res.status(403).json({message: "이메일 인증을 먼저 완료해 주세요"})
    }

    let resultMember;
    const existMember = await memberRepository.findByEmail(email);
    if(existMember && existMember.password === '') {
        try {
        existMember.password = await hash(password);
        await existMember.save();
        resultMember = existMember;
        } catch(e) {
            console.error(e);
        }
    }
    else {
        const member = await memberRepository.createMember({email: email, password: hash(password)});
        // 초기 설정 연결
        await settingRepository.createSetting(member.id);
        resultMember = member;
    }
    //자동 로그인
    jwtAuthentication(res, resultMember);

    return res.status(201).json(resultMember);
});

/* api/auth/refresh */
router.post('/auth/refresh', async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        clearToken(res);
        return res.status(401).json({ message: 'refresh token이 존재하지 않습니다.' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const userId = decoded.id;
        const token = await memberRepository.findRefreshToken(userId);
        if(!userId || token.refresh_token !== refreshToken) {
            clearToken(res);
            return res.status(401).json({ message: '비정상적인 접근이 감지되어 로그아웃 처리되었습니다.' })
        }
        issuedJwtToken(res, decoded);
    } catch(err) {
        clearToken(res);
        return res.status(401).json({ message: '토큰이 유효하지 않습니다.' })
    }

    return res.status(201).json({ message: '토큰 재발급 성공' })
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