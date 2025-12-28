const { Router } = require("express");
const MemberRepository = require("../repositorys/member.repository");
const SettingRepository = require("../repositorys/setting.repository")
const { Member, Setting } = require("../models");
const router = Router();
const passport = require("passport");
const { jwtAuthentication } = require("../utils/jwt-authentication");
const { verifyMails } = require("../utils/mail-sender");
const memberRepository = new MemberRepository(Member);
const settingRepository = new SettingRepository(Setting);

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

    return res.status(200).json({message: "로그인 성공"});
});

/* api/signup */
router.post('/signup', async (req, res) => {
    const { email, password, passwordCheck } = req.body;
    if(password != passwordCheck) {
        return res.status(403).json({message: "두 비밀번호가 일치하지 않습니다"})
    }
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!regex.test(password)) {
        return res.status(403).json({message: "숫자, 영어, 특수문자를 포함하여 8글자 이상 작성해주세요"})
    }
    if(!verifyMails.has(email)) {
        return res.status(403).json({message: "이메일 인증을 먼저 완료해 주세요"})
    }
    
    const member = await memberRepository.createMember({email: email, password: password});
    // 초기 설정 연결
    await settingRepository.createSetting(member.id);
    jwtAuthentication(res, member);

    return res.status(201).json(member);
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