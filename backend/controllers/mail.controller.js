const { Router } = require("express");
const { sendVerificationEmail, verifyMails } = require("../utils/mail-sender");
const jwt = require('jsonwebtoken');
const router = Router();
const { Member } = require("../models");
const MemberRepository = require("../repositorys/member.repository");
const memberRepository = new MemberRepository(Member);

/* api/mail/send */
router.get('/mail/send', async (req, res) => {
    const email = req.query.email;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!regex.test(email)) {
        return res.status(403).json({message: "이메일 형식을 확인해 주세요"})
    }
    const member = await memberRepository.findByEmail(email);
    if(member !== null) {
        return res.status(403).json({message: "이미 존재하는 이메일 입니다"});
    }
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({email: email}, secretKey, { expiresIn: '1h' });
    const response = await sendVerificationEmail(email, token);
    return res.status(200).json(response);
})

/* api/mail/verify/(jwt token) */
router.get('/mail/verify/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const verifiedEmail = decoded.email;
        verifyMails.add(verifiedEmail);

        /* 3분 뒤 자동 삭제 예약 */
        setTimeout(() => {
            if (verifyMails.has(verifiedEmail)) {
                verifyMails.delete(verifiedEmail);
            }
        }, 1000 * 60 * 3);
        
        res.send("<script>alert('인증되었습니다! 원래 페이지로 돌아가주세요.'); window.close();</script>");
    } catch (error) {
        res.status(400).send('토큰이 만료되었거나 유효하지 않습니다.');
    }
})

/* /api/mail/exist */
router.get('/mail/exist', (req, res) => {
    res.status(200).json({verify: verifyMails.has(req.query.email)})
})

module.exports = router;