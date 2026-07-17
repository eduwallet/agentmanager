export interface FieldValue
{
    field:string;
    value:string;
    index?:number;
}

export interface StatusListConfig {
    name:string;
    type:string;
    size:number;
    bitSize:number;
    purpose:string;
}

export interface MetadataLogo {
    uri: string;
    alt_text?:string;
}

export interface MetadataDisplay {
    name?: string;
    description?:string;
    locale?: string;
    logo?: MetadataLogo;
}

export interface MetadataCredential {
    format:string;
    scope?:string;
    credential_metadata:string;
    display: any;
    extends: any;
    statusLists?:StatusListConfig[];
}