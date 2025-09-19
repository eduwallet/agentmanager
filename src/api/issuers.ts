import { bearerFetch } from "./interface"
import { IssuerScheme } from "./types";

export async function list_issuers()
{
    return bearerFetch('GET', 'issuers')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json.data as IssuerScheme[];
        })
}

export async function save_issuer(id:IssuerScheme)
{
    return bearerFetch(id.id <= 0 ? 'PUT' : 'POST', 'issuers', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json as IssuerScheme;
        });
}

export async function delete_issuer(id:IssuerScheme)
{
    return bearerFetch('DELETE', 'issuers', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting issuer');
            return false;
        });
}
