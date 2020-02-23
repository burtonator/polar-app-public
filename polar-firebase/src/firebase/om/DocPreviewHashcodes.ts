import {URLStr} from "polar-shared/src/util/Strings";
import { Hashcodes } from "polar-shared/src/util/Hashcodes";

export class DocPreviewHashcodes {

    public static urlHash(url: URLStr) {
        return Hashcodes.create(url).substring(0, 20);
    }

}
