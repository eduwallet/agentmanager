import { useTokenStore } from "@/stores/token";

function glueParameters(path:string, data:any)
{
    var glue='?';
    if (path.indexOf('?') > 0) {
        glue = '&';
    }
    var elements = Object.keys(data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    });
    return path + glue + elements.join('&');
}

export async function bearerFetch(method: string, path:string, data:any = null)
{
    const store = useTokenStore();

    const contentHeaders = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + store.token
    }

    const fetchOptions = Object.assign({
        headers: contentHeaders,
        redirect: <RequestRedirect>"manual",
        method: method
    }) as RequestInit;

    let dataPath = path; // copy the path before we add parameters
    if (data && (method == 'POST' || method == 'PUT' || method == 'DELETE')) {
        fetchOptions.body = JSON.stringify(data);
    }
    else if (data && method == 'GET') {
        dataPath = glueParameters(path, data);
    }

    return fetch(store.url + '/api/' + path, fetchOptions).then(async (r) => { return {status: r.status, json: await r.json() }});
}