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

    interface Constraint {
        readonly maxHeight: number;
        readonly maxWidth: number;
    }

    export function constrain(dimensions: IDimensions, constraint: Constraint): IDimensions {
        return constrainByWidth(constrainByHeight(dimensions, constraint.maxHeight), constraint.maxWidth);
        // return constrainByHeight(dimensions, constraint.maxHeight);
    }

    export function constrainByHeight(dimensions: IDimensions, maxHeight: number): IDimensions {

        const newHeight = Math.min(dimensions.height, maxHeight);
        const newWidth = Math.floor((newHeight / dimensions.height) * dimensions.width);

        return {
            height: newHeight,
            width: newWidth
        };

    }

    export function constrainByWidth(dimensions: IDimensions, maxWidth: number): IDimensions {

        const newWidth = Math.min(dimensions.width, maxWidth);
        const newHeight = Math.floor((newWidth / dimensions.width) * dimensions.height);

        return {
            height: newHeight,
            width: newWidth
        };

    }

}
