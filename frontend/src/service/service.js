const endpoint = 'http://172.18.0.3:8000/graphql'

const api = (reqBody, token = null, onSuccess = null, onError = null) => {
    const headers = { 'Content-Type': 'application/json' };
    token && (headers['Authorization'] = 'Bearer ' + token);

    const body = JSON.stringify(reqBody);

    fetch(endpoint, { method: 'POST', body, headers })
    .then(res => {
        if (res.status !== 200 && res.status !== 201 ) {
            throw new Error('Failed!');
        }
        return res.json();
    })
    .then(res => {
        if (res.errors) {
            throw new Error(res.errors[0].message);
        }
        onSuccess && onSuccess(res);
        
    })
    .catch(err => {
        onError && onError(err);
        console.error(err);
    });

}

export default api;