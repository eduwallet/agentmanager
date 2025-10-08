import { bearerFetch } from "./interface"
import { StatusListScheme } from "./types";

export async function list_configurations()
{
    return bearerFetch('GET', 'lists')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval:StatusListScheme[] = [];
            for(const obj of (result.json.data as StatusListScheme[])) {
                obj.messagesString = obj.messages;
                retval.push(obj);
            }
            return retval;
        })
}

export async function get_configuration(id:StatusListScheme)
{
    return bearerFetch('GET', 'lists/' + id.id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const obj:StatusListScheme = result.json;
            obj.messagesString = obj.messages;
            return obj;
        });
}

export async function save_configuration(id:StatusListScheme)
{
    return bearerFetch(id.id <= 0 ? 'PUT' : 'POST', 'lists', id)
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const obj:StatusListScheme = result.json;
            obj.messagesString = obj.messages;
            return obj;
        });
}

export async function delete_configuration(id:StatusListScheme)
{
    return bearerFetch('DELETE', 'lists', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting status list configuration');
            return false;
        });
}
