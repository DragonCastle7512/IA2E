import { get } from "../utils/api-layer.js";

document.addEventListener('DOMContentLoaded', () => {
    const verifyBtn = document.getElementById("verify-button");
    verifyBtn.addEventListener('click', async () => {
        const email = document.getElementById('email');
        await get(`/mail/send?email=${email.value}`);
    });
});