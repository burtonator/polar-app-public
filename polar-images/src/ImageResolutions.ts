require('blueimp-load-image/js/load-image-exif.js');
require('blueimp-load-image/js/load-image-exif-map.js');
require('blueimp-load-image/js/load-image-iptc.js');
require('blueimp-load-image/js/load-image-iptc-map.js');
require('blueimp-load-image/js/load-image-meta.js');
require('blueimp-load-image/js/load-image-orientation.js');
require('blueimp-load-image/js/load-image-scale.js');
import loadImage from "blueimp-load-image";

export namespace ImageResolutions {

    export interface IImageResolution {

    }

    export async function compute(file: File | Blob): Promise<number | undefined> {

        // https://stackoverflow.com/questions/1839983/image-dpi-using-javascript

        const meta = await loadImage(file, {meta: true, orientation: true});

        console.log("FIXME: ", meta);

        if (meta.exif) {

            const resX = meta.exif.get('XResolution' as any);
            const resY = meta.exif.get('YResolution' as any);

            console.log("FIXME: no resX:", resX);

            if (typeof resX === 'number' && typeof resY === 'number') {
                return Math.min(resX, resY);
            }

        } else {
            console.log("FIXME: no exif3");
        }

        return undefined;

    }
    //
    // export async function compute(arrayBuffer: ArrayBuffer): Promise<number | undefined> {
    //
    //     // https://stackoverflow.com/questions/1839983/image-dpi-using-javascript
    //
    //     const data = EXIF.readFromBinaryFile(arrayBuffer);
    //
    //     // exif-js only reads EXIT from jpg files...
    //
    //     console.log("FIXME: data: ", data);
    //     return undefined;
    //
    //     //
    //     // const meta = await loadImage(file, {});
    //     //
    //     // if (meta.exif) {
    //     //
    //     //     const resX = meta.exif.get('XResolution' as any);
    //     //     const resY = meta.exif.get('YResolution' as any);
    //     //
    //     //     console.log("FIXME: no resX:", resX);
    //     //
    //     //     if (typeof resX === 'number' && typeof resY === 'number') {
    //     //         return Math.min(resX, resY);
    //     //     }
    //     //
    //     // } else {
    //     //     console.log("FIXME: no exif");
    //     // }
    //     //
    //     // return undefined;
    //
    // }

}
