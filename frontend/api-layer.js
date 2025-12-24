const API_ENDPOINT = '/api';


async function get(url) {
    const response = await fetch(API_ENDPOINT + url);

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
    
    
    return response; 
}

async function del(url) {
    const response = await fetch(API_ENDPOINT + url, {
        method: 'DELETE',
    });
    
    
    return response;
}

export { get, post, put, del };