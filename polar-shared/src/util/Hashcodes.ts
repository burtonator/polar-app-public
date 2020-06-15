import {keccak256} from 'js-sha3';
import uuid from 'uuid';
import {InputSource} from './input/InputSource';
import {InputData, InputSources} from './input/InputSources';
import {Preconditions} from '../Preconditions';
import {HashAlgorithm, Hashcode, HashEncoding} from "../metadata/Hashcode";

// TODO: migrate this to use types or build our own API for base58check direclty.
const base58check = require("base58check");

/**
 * Create hashcodes from string data to be used as identifiers in keys.
 */
export class Hashcodes {

    public static create(data: any): string {
        Preconditions.assertPresent(data, "data");

        function toRawData(): string | ArrayBuffer | Uint8Array {

            if (typeof data === 'string') {
                return data;
            }

            if (data instanceof ArrayBuffer) {
                return data;
            }

            if (data instanceof Uint8Array) {
                return data;
            }

            if (typeof data === 'object') {
                // we were given an object and convert it to JSON first.
                return JSON.stringify(data);
            }

            return data;

        }

        const rawData = toRawData();

        return base58check.encode(keccak256(rawData));
    }

    public static createHashcode(data: any): Hashcode {

        return {
            enc: HashEncoding.BASE58CHECK,
            alg: HashAlgorithm.KECCAK256,
            data: this.create(data)
        }
    }

    /**
     * Create a Base58Check encoded KECCAK256 hashcode by using the stream API
     * on a given stream.
     *
     * @param readableStream The stream for which we should create a hashcode.
     */
    public static async createFromStream(readableStream: NodeJS.ReadableStream): Promise<string> {

        const hasher = keccak256.create();

        return new Promise<string>((resolve, reject) => {

            readableStream.on('end', chunk => {
                resolve(base58check.encode(hasher.hex()));
            });

            readableStream.on('error', err => {
                reject(err);
            });

            // data resumes the paused stream so end/error have to be added
            // first.
            readableStream.on('data', chunk => {
                hasher.update(chunk);
            });

        });

    }

    public static async createFromInputSource(inputSource: InputSource): Promise<string> {

        const hasher = keccak256.create();

        return new Promise<string>((resolve, reject) => {

            InputSources.open(inputSource, (data: InputData | undefined, err: Error | undefined) => {

                if (err) {
                    reject(err);
                }

                if (data) {
                    hasher.update(data);
                } else {
                    resolve(base58check.encode(hasher.hex()));
                }

            });

        });

    }

    /**
     * Create a hashcode as a truncated SHA hashcode.
     * @param obj {Object} The object to has to form the ID.
     * @param [len] The length of the hash you want to create.
     */
    public static createID(obj: any, len = 10) {

        const id = this.create(JSON.stringify(obj));

        // truncate.  We don't need that much precision against collision.
        return id.substring(0, len);

    }

    /**
     * Create a random ID which is the the same format as createID() (opaque).
     */
    public static createRandomID(len = 10) {
        return this.createID({uuid: uuid.v4()}, len);
    }

}
