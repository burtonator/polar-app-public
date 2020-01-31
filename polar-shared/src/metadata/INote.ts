import {Text} from "./Text";
import {IVersionedObject} from "./IVersionedObject";

export interface INote extends IVersionedObject {

    /**
     * The content of this note.
     */
    content: Text;

}
