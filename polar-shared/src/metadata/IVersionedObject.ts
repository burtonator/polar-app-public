import {ISODateTimeString} from "./ISODateTimeStrings";
import {Ref} from "./Refs";
import {IAuthor} from "./IAuthor";
import {IDStr} from "../util/Strings";

export interface IVersionedObject {

    /**
     * The unique ID for this object.  Every object needs to have a unique ID so
     * that we can reference it easily.  The ID should represent the immutable
     * form of this object. If the object is mutated the id should change.
     */
    id: IDStr;

    /**
     * When an object is created it has an id just like every other annotation
     * object however, we can update them over time and when it's updated we
     * need to generate a new id.  The guid allows us to reference an object as
     * it changes over time.  If the user updates the object we keep the same
     * guid so we have a unique handle on the annotation as it's edited and the
     * initial guid never changes but the id is still essentially the pk.
     *
     * Example:
     *
     * On creation:
     *
     * id: 10101, guid: 10101
     *
     * on first edit
     *
     * id: 10102, guid: 10101
     *
     */
    guid: IDStr;

    /**
     * The time this object was created
     *
     */
    created: ISODateTimeString;

    /**
     * The last time this annotation was updated (note changed, moved, etc).
     */
    lastUpdated: ISODateTimeString;

    /**
     * The author who created this object.
     */
    author?: IAuthor;

    /**
     * A reference to the parent annotation (if any).
     */
    ref?: Ref;

}
