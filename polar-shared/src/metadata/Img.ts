/**
 * Image src with width, height, and URL.
 */
import {URLStr} from "../util/Strings";

export interface Img {
    readonly width: number;
    readonly height: number;
    readonly src: URLStr;
}
