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
    path?:string;
    services?:string;
    saved: string;
    updated:string;
    keys:KeyScheme[];
}

export interface IdentifierSaveData
{
    did: string;
    provider: string;
    alias: string;
    path?:string;
    services?:string;
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
    document:any;
    documentString?:string;
    saved?: string;
    updated?:string;
}

export interface VCTScheme {
    id?: number;
    name:string;
    path:string;
    credentials:string|string[];
    credentialsString?:string;
    document:any;
    documentString?:string;
    saved?: string;
    updated?:string;
}


export interface PresentationScheme
{
    id:number;
    shortname:string;
    name:string;
    purpose:string;
    input_descriptors?:string;
    query?:string;
    saved?: string;
    updated?:string;
}

export interface VerifierScheme
{
    id:number;
    name:string;
    path:string;
    did:string;
    admin_token:string;
    presentations:string;
    saved?: string;
    updated?:string;
}

export interface StatusListScheme
{
    id: number;
    name: string;
    purpose: string;
    type: string;
    size: number;
    bitsize: number;
    tokens: string;
    messages?:string;
    messagesString?:string;
    saved?: string;
    updated?:string;
}
