import { del } from "../utils/api-layer.js";

/* 로그아웃 이후 뒤로가기 시 새로고침(캐시 제어) */
window.onpageshow = function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        window.location.reload();
    }
};

/* 로그아웃 버튼  */
function setupLogoutButton() {
    document.getElementById('loginBtn').addEventListener('click', async () => {
        try {
            const response = await del('/logout');
            if (response.ok) {
                const json = await response.json();
                alert(json.message);
                location.href('/login');
            }
        } catch(e) {
            console.log('로그아웃 실패', e);
        }
    });
};

export { setupLogoutButton };