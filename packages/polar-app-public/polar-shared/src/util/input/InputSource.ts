import {PathStr, URLStr} from '../Strings';

/**
 * Typed InputSource to allow us to create a stream from the underlying data.
 */
export interface InputSource {

    type: InputSourceType;

    value: InputSourceValue;

    /**
     * An optional basename of this resource.  For example if this was a URL like
     * http://example.com/mybook.pdf the basename would be mybook.pdf.
     */
    basename?: string;

}

/**
 * path: A path to a local file
 *
 * file: A file object in the browser (file upload)
 *
 * blob: A blob in the browser (file upload)
 *
 * url: A url to a network resource that should be fetched
 *
 * stream: A node stream
 *
 * buffer: A node buffer
 */
export type InputSourceType = 'path' | 'file' | 'blob' | 'url' | 'stream' | 'buffer';

export type InputSourceValue = PathStr | File | Blob | URLStr | NodeJS.ReadableStream | Buffer;
