import { bearerFetch } from "./interface"
import { IdentifierSaveData, IdentifierScheme } from "./types";

// the identifiers API is exactly the same between issuer and verifier, so we reuse the same code

export async function list_identifiers()
{
    return bearerFetch('GET', 'identifiers')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json.data as IdentifierScheme[];
        })
}

export async function save_identifier(id:IdentifierSaveData)
{
    return bearerFetch(id.did === '' ? 'PUT' : 'POST', 'identifiers', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json as IdentifierScheme;
        });
}

export async function delete_identifier(id:IdentifierScheme)
{
    return bearerFetch('DELETE', 'identifiers', {did: id.did})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting identifier');
            return false;
        });
}
