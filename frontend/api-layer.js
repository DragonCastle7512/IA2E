const API_ENDPOINT = 'http://localhost:3000/api';

async function get(url) {
    const response = await fetch(API_ENDPOINT + url);
    
    if (!response.ok) { 
        throw new Error(`요청 실패: ${response.status}`);
    }
    
    return response.json();
}

async function post(url, obj) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
    if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
    }
    return response.json();
}

async function put(url, obj) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
    
    if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }
    
    return response.json(); 
}

async function del(url) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'DELETE',
    });
    
    if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
    }
    
    return response.status === 204 ? null : response.json();
}
