import md5 from 'blueimp-md5';
import {keccak256} from 'js-sha3';

/**
 * Specific hashcode algorithms
 */
export class HashcodeAlgorithms {

    public static md5(data: string) {
        return md5(data);
    }

    public static keccak256(data: string) {
        return keccak256(data);
    }

}
