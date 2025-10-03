import { bearerFetch } from "./interface"
import { PresentationScheme } from "./types";

export async function list_presentations()
{
    return bearerFetch('GET', 'presentations')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json.data as PresentationScheme[];
        })
}

export async function get_presentation(id:PresentationScheme)
{
    return bearerFetch('GET', 'presentations/' + id.id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json as PresentationScheme;
        });
}

export async function save_presentation(id:PresentationScheme)
{
    return bearerFetch(id.id <= 0 ? 'PUT' : 'POST', 'presentations', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json as PresentationScheme;
        });
}

export async function delete_presentation(id:PresentationScheme)
{
    return bearerFetch('DELETE', 'presentations', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting presentation');
            return false;
        });
}
