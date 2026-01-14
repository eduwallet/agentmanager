import { bearerFetch } from "./interface"
import { VerifierScheme } from "./types";

export async function list_verifiers()
{
    return bearerFetch('GET', 'verifiers')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const verifiers = result.json.data.map((v) => {
                try {
                    v.metadata = JSON.stringify(JSON.parse(v.metadata), null, 2);
                }
                catch (e) {
                    console.log(e);
                    if (v.metadata) {
                        console.log('deleting non-JSON metadata value', v.metadata);
                        delete v.metadata;
                    }
                }
                console.log('returning value ', v);
                return v;
            });
            console.log('verifiers', verifiers);
            return verifiers;
        })
}

export async function get_verifier(id:VerifierScheme)
{
    return bearerFetch('GET', 'verifiers/' + id.id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            try {
                result.json.metadata = JSON.stringify(JSON.parse(result.json.metadata), null, 2);
            }
            catch {
                if (result.json.metadata) {
                    delete result.json.metadata;
                }
            }
            return result.json;
        });
}

export async function save_verifier(id:VerifierScheme)
{
    return bearerFetch(id.id <= 0 ? 'PUT' : 'POST', 'verifiers', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json;
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
