import { bearerFetch } from "./interface"
import { IdentifierScheme } from "./types";

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

export async function save_identifier(id:IdentifierScheme)
{
    return bearerFetch(id.did === '' ? 'PUT' : 'POST', 'identifiers', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json as IdentifierScheme;
        });
}
