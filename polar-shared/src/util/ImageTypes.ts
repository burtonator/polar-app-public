import {ImageType} from "./ImageType";

export namespace ImageTypes {

    export const IMAGE_TYPES = ['image/png' , 'image/jpeg' , 'image/webp' , 'image/gif' ];

    export function isImageType(type: string): type is ImageType {
        return IMAGE_TYPES.includes(type);
    }

}