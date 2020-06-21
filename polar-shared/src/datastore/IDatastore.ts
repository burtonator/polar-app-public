import {DocFileMeta} from "./DocFileMeta";
import {FileRef} from "./FileRef";
import { Backend } from "./Backend";

/**
 *
 * The network layer specifies the access to a resource based on the network
 * type.  By default each datastore figures out the ideal network layer to
 * return file references from but based on the capabilities the caller
 * can specify a specific layer.
 *
 * The following types are supported:
 *
 * local: Access via the local disk.
 *    - pros:
 *      - VERY fast
 *    - cons:
 *      - Not sharable with others
 *
 * web: Access is available via the public web.
 *    - pros:
 *       - sharing works
 *       - access across multiple devices
 *    - cons:
 *       - may not be usable for certain people (classified information, etC).
 *
 */
export type NetworkLayer = 'local' | 'web';

export class NetworkLayers {

    public static LOCAL = new Set<NetworkLayer>(['local']);

    public static LOCAL_AND_WEB = new Set<NetworkLayer>(['local', 'web']);

    public static WEB = new Set<NetworkLayer>(['web']);

}

export interface ReadableBinaryDatastore {

    containsFile(backend: Backend, ref: FileRef): Promise<boolean>;

    getFile(backend: Backend, ref: FileRef, opts?: GetFileOpts): DocFileMeta;

}

/**
 * Options for getFile
 */
export interface GetFileOpts {

    /**
     * Allows the caller to specify a more specific network layer for the
     * file operation and returning a more specific URL.
     */
    readonly networkLayer?: NetworkLayer;

}

export type ReadableBinaryDatastoreProvider = () => ReadableBinaryDatastore;
