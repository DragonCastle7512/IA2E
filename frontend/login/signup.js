import { get, post } from "../utils/api-layer.js";

let emailCheckInterval = null;
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData);
        try {
            const response = await post('/signup', data);
            if (response.status === 403) {
                const result = await response.json();
                alert(result.message); 
            }
            else if(response.ok) {
                window.location.href = '/';
            }
        } catch(err) {
            console.error(err);
        }
    });

    const emailInput = document.getElementById('email');
    let lastEmail = "";
    emailInput.addEventListener('input', () => {
        if (emailInput.value !== lastEmail) {
            verifyBtn.disabled = false;
            verifyBtn.innerText = "인증";
            if(sendTimer) {
                clearInterval(sendTimer);
            }
        }
    });

    const verifyBtn = document.getElementById("verifyButton");
    let timeLimit, sendTimer;
    const startTimer = () => {
        verifyBtn.disabled = true;
        timeLimit = 30;
        verifyBtn.innerText = `${timeLimit}s`;
        sendTimer = setInterval(() => {
            if (timeLimit <= 0) {
                clearInterval(sendTimer);
                verifyBtn.innerText = "재전송";
                verifyBtn.disabled = false;
                timeLimit = 30;
            } else {
                timeLimit--;
                verifyBtn.innerText = `${timeLimit}s`;
            }
        }, 1000);
    };

    verifyBtn.addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        document.getElementById('verifyState').classList.remove('active');
        startTimer();
        const mailResponse = await get(`/mail/send?email=${email}`);
        if(!mailResponse.ok) {
            const mailJson = await mailResponse.json();
            alert(mailJson.message);
            if(sendTimer) {
                clearInterval(sendTimer);
            }
            verifyBtn.disabled = false;
            verifyBtn.innerText = "인증";
            return;
        }
       
        if (emailCheckInterval) {
            clearInterval(emailCheckInterval);
        }
        
        /* 3초 주기로 인증 확인 */
        emailCheckInterval = setInterval(async () => {
            try {
                const response = await get(`/mail/exist?email=${email}`);
                const { verify } = await response.json();
                if (verify) {
                    clearInterval(emailCheckInterval);
                    emailCheckInterval = null;
                    document.getElementById('verifyState').classList.add('active');
                }
            } catch (error) {
                console.error("체크 중 오류 발생:", error);
            }
        }, 3000);
     });
});