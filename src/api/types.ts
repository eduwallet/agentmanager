export interface DataList {
    offset: number;
    count: number;
    pagesize: number;
    data: any[];
}

export interface KeyScheme
{
    kid:string;
    type: string;
    publicKey: string;
    isController: boolean;
}

export interface IdentifierScheme
{
    did: string;
    provider: string;
    alias: string;
    saved: string;
    updated:string;
    keys:KeyScheme[];
}

export interface IdentifierSaveData
{
    did: string;
    provider: string;
    alias: string;
    keytype:string;
    original:string;
}

export interface IssuerScheme
{
    id: number;
    name: string;
    baseUrl: string;
    adminToken: string;
    authorizationEndpoint?:string;
    tokenEndpoint?:string;
    clientId?:string;
    did:string;
    metadata?:any;
    statusLists?:any;
}