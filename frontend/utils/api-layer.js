const API_ENDPOINT = '/api';

let silentRefreshTimeout = null;
// 토큰 재발급 함수
const onSilentRefresh = async () => {
    if (silentRefreshTimeout) {
        clearTimeout(silentRefreshTimeout);
    }
    const currentPath = window.location.pathname.replace(/\/$/, "");
    if (currentPath === '/login' || currentPath === '/signup') {
        return;
    }

    try {
        const response = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include'});
        if (response.status === 401) {
            window.location.href = '/login'
            return;
        }

        if (response.ok) {
            setTimeout(onSilentRefresh, 58 * 60 * 1000); 
        }
    } catch (error) {
        console.error("토큰 발급 도중 오류가 발생 했습니다.");
    }
};

onSilentRefresh();

const handleResponse = (response) => {
    if (response.status === 429) {
        window.location.href = '/error/429.html';
        throw new Error('Too many requests'); 
    }
    return response;
};

async function get(url) {
    const response = await fetch(API_ENDPOINT + url);

    return handleResponse(response);
}

async function post(url, obj) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });

    return handleResponse(response);
}

async function put(url, obj) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
    
    return handleResponse(response);
}

async function del(url) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'DELETE',
    });
    
    return handleResponse(response);
}

export { get, post, put, del };