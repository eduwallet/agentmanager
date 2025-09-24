import { bearerFetch } from "./interface"
import { CredentialScheme } from "./types";

export async function list_credentials()
{
    return bearerFetch('GET', 'credentials')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            const retval:CredentialScheme[] = [];
            for(const cred of (result.json.data as CredentialScheme[])) {
                cred.configurationString = cred.configuration;
                cred.configuration = JSON.parse(cred.configuration);
                retval.push(cred);
            }
            return retval;
        })
}

export async function save_credential(id:CredentialScheme)
{
    return bearerFetch((!id.id || id.id <= 0) ? 'PUT' : 'POST', 'credentials', { id: id.id, name: id.name, configuration: JSON.stringify(id.configuration)})
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return result.json as CredentialScheme;
        });
}

export async function delete_credential(id:CredentialScheme)
{
    return bearerFetch('DELETE', 'credentials', {id: id.id})
        .then((result) => {
            if (result.status !== 202) {
                throw new Error("Invalid return status" + result.status);
            }
            return true;
        })
        .catch(() => {
            console.error('caught error on deleting credential');
            return false;
        });
}
