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

async function fetchData(url, method = 'GET', body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(API_ENDPOINT + url, options);
    
    return await handleResponse(response, url, method, body);
}

const handleResponse = async (response, url, method, body) => {
    if (response.status === 429) {
        window.location.href = '/error/429.html';
        throw new Error('Too many requests'); 
    }

    if (response.status === 403 || response.status === 401) {
        try {
            await onSilentRefresh();

            return await fetchData(url, method, body);
        } catch (err) {
            console.error("세션이 만료되었습니다. 다시 로그인해주세요.");
            throw err;
        }
    }
    return response;
};

async function get(url) {
    return fetchData(url, 'GET');
}

async function post(url, obj) {
    return fetchData(url, 'POST', obj);
}

async function put(url, obj) {
    return fetchData(url, 'PUT', obj);
}

async function del(url) {
    return fetchData(url, 'DELETE');
}

export { get, post, put, del };