import { bearerFetch, bearerFetchRaw } from "./interface"

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

export async function export_configuration()
{
    return bearerFetchRaw('GET', 'export')
        .then(async (result) => {
            if (result.status !== 200) {
                throw new Error(`Invalid return status ${result.status}`);
            }
            const blob = await result.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'configuration.zip'; // force filename
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        });
}
