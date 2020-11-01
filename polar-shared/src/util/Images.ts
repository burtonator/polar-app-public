import {URLStr} from "./Strings";
import {IDimensions} from "./IDimensions";

export namespace Images {

    export function getDimensions(url: URLStr): Promise<IDimensions> {

        return new Promise<IDimensions>((resolve, reject) => {

            const img = new Image();

            img.onload = () => {
                resolve({width: img.width, height: img.height});
            }

            img.onerror = (event, lineno, colno, error) => {
                reject(error);
            }

            img.src = url;

        });

    }
}