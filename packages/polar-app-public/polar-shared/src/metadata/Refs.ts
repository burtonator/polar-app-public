import {AnnotationType} from './AnnotationType';

export class Refs {

    public static create(id: string, type: RefType): Ref {
        return `${type}:${id}`;
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

    private static toRefType(type: AnnotationType) {

        switch (type) {

            case AnnotationType.TEXT_HIGHLIGHT:
                return 'text-highlight';

            case AnnotationType.AREA_HIGHLIGHT:
                return 'area-highlight';

            case AnnotationType.FLASHCARD:
                return 'flashcard';

        }

        throw new Error("Not handled yet: " + type);

    }

}

export interface IRef {
    readonly type: RefType;
    readonly value: string;
}

export type RefType = 'page' | 'comment' | 'pagemark' | 'note' | 'question' | 'flashcard' | 'text-highlight' | 'area-highlight';

/**
 * A reference to another annotation.
 */
export type Ref = string;
