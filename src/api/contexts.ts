import { bearerFetch } from "./interface"
import { ContextScheme } from "./types";

export async function list_contexts()
{
    return bearerFetch('GET', 'contexts')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval:ContextScheme[] = [];
            for(const obj of (result.json.data as ContextScheme[])) {
                obj.documentString = obj.document;
                obj.document = JSON.parse(obj.document);
                retval.push(obj);
            }
            return retval;
        })
}

export async function save_context(id:ContextScheme)
{
    return bearerFetch((!id.id || id.id <= 0) ? 'PUT' : 'POST', 'contexts', { id: id.id, name: id.name, path: id.path, document: JSON.stringify(id.document)})
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const obj = result.json as ContextScheme;
            obj.documentString = obj.document;
            obj.document = JSON.parse(obj.document);
            return obj;
        });
}

export async function delete_context(id:ContextScheme)
{
    return bearerFetch('DELETE', 'contexts', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting context');
            return false;
        });
}
