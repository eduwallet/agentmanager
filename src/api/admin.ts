import { bearerFetch } from "./interface"

export async function process_exit()
{
    return bearerFetch('GET', 'exit')
        .then((result) => {
            if (result.status !== 200) {
                throw new Error("Invalid return status");
            }
            return;
        });
}
