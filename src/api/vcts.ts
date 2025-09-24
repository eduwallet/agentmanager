import { bearerFetch } from "./interface"
import { VCTScheme } from "./types";

export async function list_vcts()
{
    return bearerFetch('GET', 'vcts')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval:VCTScheme[] = [];
            for(const obj of (result.json.data as VCTScheme[])) {
                obj.documentString = obj.document;
                obj.document = JSON.parse(obj.document);
                obj.credentialsString = obj.credentials;
                obj.credentials = JSON.parse(obj.credentialsString);
                retval.push(obj);
            }
            return retval;
        })
}

export async function save_vct(id:VCTScheme)
{
    return bearerFetch((!id.id || id.id <= 0) ? 'PUT' : 'POST', 'vcts', { id: id.id, name: id.name, path: id.path, credentials: JSON.stringify(id.credentials), document: JSON.stringify(id.document)})
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const obj = result.json as VCTScheme;
            obj.documentString = obj.document;
            obj.document = JSON.parse(obj.document);
            obj.credentialsString = obj.credentials;
            obj.credentials = JSON.parse(obj.credentials);
            return obj;
        });
}

export async function delete_vct(id:VCTScheme)
{
    return bearerFetch('DELETE', 'vct', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting vct document');
            return false;
        });
}
