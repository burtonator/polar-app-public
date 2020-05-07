import {AnnotationType} from './AnnotationType';
import {IDStr} from "../util/Strings";

interface IReferencable {
    readonly id: IDStr;
    readonly annotationType: AnnotationType;
}

export class Refs {

    public static createRef(referencable: IReferencable): IRef {
        return {
            value: referencable.id,
            type: this.toRefType(referencable.annotationType)
        };
    }

    public static create(id: string, type: RefType): Ref {
        return `${type}:${id}`;
    }

    public static format(ref: IRef): string {
        return this.create(ref.value, ref.type);
    }

    public static createFromAnnotationType(id: string, type: AnnotationType) {
        return this.create(id, this.toRefType(type));
    }

    public static parse(value: string): IRef {
        const split = value.split(":");

        return {
            type: <RefType> split[0],
            value: split[1]
        };

    }

    public static toRefType(type: AnnotationType) {

        switch (type) {

            case AnnotationType.TEXT_HIGHLIGHT:
                return 'text-highlight';

            case AnnotationType.AREA_HIGHLIGHT:
                return 'area-highlight';

            case AnnotationType.FLASHCARD:
                return 'flashcard';

            case AnnotationType.COMMENT:
                return 'comment';

        }

        throw new Error("Not handled yet: " + type);

    }

}

export interface IRef {
    readonly type: RefType;
    // TODO: probably should be 'id'
    readonly value: string;
}

export type RefType = 'page' | 'comment' | 'pagemark' | 'note' | 'question' | 'flashcard' | 'text-highlight' | 'area-highlight';

/**
 * A reference to another annotation.
 */
export type Ref = string;
