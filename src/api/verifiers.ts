import { bearerFetch } from "./interface"
import { VerifierScheme } from "./types";

export async function list_verifiers()
{
    return bearerFetch('GET', 'verifiers')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval:VerifierScheme[] = [];
            for(const obj of (result.json.data as VerifierScheme[])) {
                obj.presentationsString = obj.presentations;
                obj.presentations = JSON.parse(obj.presentations);
                retval.push(obj);
            }
            return retval;
        })
}

export async function get_verifier(id:VerifierScheme)
{
    return bearerFetch('GET', 'verifiers/' + id.id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const obj:VerifierScheme = result.json;
            obj.presentationsString = obj.presentations;
            obj.presentations = JSON.parse(obj.presentations);
            return obj;
        });
}

export async function save_verifier(id:VerifierScheme)
{
    return bearerFetch(id.id <= 0 ? 'PUT' : 'POST', 'verifiers', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const obj:VerifierScheme = result.json;
            obj.presentationsString = obj.presentations;
            obj.presentations = JSON.parse(obj.presentations);
            return obj;
        });
}

export async function delete_verifier(id:VerifierScheme)
{
    return bearerFetch('DELETE', 'verifiers', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting verifier');
            return false;
        });
}
