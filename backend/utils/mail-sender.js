const nodemailer = require('nodemailer');

// Transport 정의
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

// 인증 메일 발송 함수
const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.BASE_URL}/api/mail/verify/${token}`;
    try {
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: email,
            subject: '이메일 인증을 완료해주세요!',
            html: `아래 링크를 클릭하면 인증이 완료됩니다.<br><a href="${url}">이메일 인증</a>`
        });
    } catch(err) {
        console.error(err)
    }
};

module.exports = { sendVerificationEmail };