const { Router } = require("express");
const { sendVerificationEmail } = require("../utils/mail-sender");
const jwt = require('jsonwebtoken');
const router = Router();

/* api/mail/send */
router.get('/mail/send', async (req, res) => {
    const email = req.query.email;
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({email: email}, secretKey, { expiresIn: '1h' });
    // db 임시 삽입 로직
    const response = await sendVerificationEmail(email, token);
    return res.status(200).json(response);
})

/* api/mail/verify/(jwt token) */
router.get('/mail/verify/:token', async (req, res) => {
    const { token } = req.params;
    console.log(token)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const verifiedEmail = decoded.email;
        // db 인증 로직
        console.log(verifiedEmail)

        res.send("<script>alert('인증되었습니다! 원래 페이지로 돌아가주세요.'); window.close();</script>");
    } catch (error) {
        res.status(400).send('토큰이 만료되었거나 유효하지 않습니다.');
    }
})

module.exports = router;