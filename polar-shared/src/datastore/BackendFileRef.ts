import {Backend} from "./Backend";
import {FileRef} from "./FileRef";

/**
 * A FileRef with a backend.
 */
export interface BackendFileRef extends FileRef {

    readonly backend: Backend;

}
