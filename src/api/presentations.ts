import { bearerFetch } from "./interface"
import { PresentationScheme } from "./types";

export async function list_presentations()
{
    return bearerFetch('GET', 'presentations')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval:PresentationScheme[] = [];
            for(const obj of (result.json.data as PresentationScheme[])) {
                if (obj.input_descriptors) {
                    obj.input_descriptors = JSON.stringify(JSON.parse(obj.input_descriptors),null, 2);
                }
                if (obj.query) {
                    obj.query = JSON.stringify(JSON.parse(obj.query),null, 2);
                }
                retval.push(obj);
            }
            return retval;
        })
}

export async function get_presentation(id:PresentationScheme)
{
    return bearerFetch('GET', 'presentations/' + id.id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval = result.json as PresentationScheme;
            if (retval.input_descriptors) {
                retval.input_descriptors = JSON.stringify(JSON.parse(retval.input_descriptors),null, 2);
            }
            if (retval.query) {
                retval.query = JSON.stringify(JSON.parse(retval.query),null, 2);
            }
            return retval;
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
