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

export interface CredentialScheme
{
    id?:number;
    name: string;
    configuration:any;
    configurationString?:string;
    saved?: string;
    updated?:string;
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

export interface ContextScheme {
    id?: number;
    name:string;
    path:string;
    document:string;
    documentString?:string;
    saved: string;
    updated:string;
}

export interface VCTScheme {
    id?: number;
    name:string;
    path:string;
    credentials:string;
    credentialsString?:string;
    document:string;
    documentString?:string;
    saved: string;
    updated:string;
}