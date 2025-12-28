import { post } from "../utils/api-layer.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData);
        try {
            const response = await post('/login', data);
            if (response.status === 401) {
                const result = await response.json();
                alert(result.message); 
            }
            else if(response.ok) {
                window.location.href = '/';
            }
        } catch(err) {
            console.error(err);
        }
    })
})