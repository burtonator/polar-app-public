import {Text} from "./Text";
import {IAnnotation} from "./IAnnotation";

export interface INote extends IAnnotation {

    /**
     * The content of this note.
     */
    content: Text;

}
