const API_ENDPOINT = '/api';

function checkStatus(response) {
    if(response.status === 401 || response.status === 403) {
         window.location.href = '/login/login.html';
    }
    if (!response.ok) { 
        throw new Error(`요청 실패: ${response.status}`);
    }
}

async function get(url) {
    const response = await fetch(API_ENDPOINT + url);
    checkStatus(response);

    return response;
}

async function post(url, obj) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
    checkStatus(response);

    return response;
}

async function put(url, obj) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
    
    checkStatus(response);
    
    return response; 
}

async function del(url) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'DELETE',
    });
    
    checkStatus(response);
    
    return response;
}

export { get, post, put, del };