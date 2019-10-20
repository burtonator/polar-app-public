
export interface Hashcode {
    readonly enc: HashEncoding;
    readonly alg: HashAlgorithm;
    readonly data: string;
}

export enum HashEncoding {
    BASE58CHECK = 'base58check'
}

export enum HashAlgorithm {
    KECCAK256 = 'keccak256'
}


