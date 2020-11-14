export namespace StringComparators {

    type StringLike = string | null | undefined;

    type Order = 'asc' | 'desc';

    export function comparatorWithEmptyStringsLast(a: StringLike, b: StringLike, order: Order): number {

        switch (order) {

            case "asc":
                return comparatorWithEmptyStringsLastAsc(a, b);

            case "desc":
                return comparatorWithEmptyStringsLastDesc(a, b);

        }

    }


    function comparatorWithEmptyStringsLastAsc(a: StringLike, b: StringLike): number {

        if (a === null || a === undefined || a === '') {
            return 1;
        }

        if (b === null || b === undefined || b === '') {
            return -1;
        }

        if (a === b) {
            return 0;
        }

        return a.localeCompare(b);

    }

    function comparatorWithEmptyStringsLastDesc(a: StringLike, b: StringLike): number {

        if (a === null || a === undefined || a === '') {
            return 1;
        }

        if (b === null || b === undefined || b === '') {
            return -1;
        }

        if (a === b) {
            return 0;
        }

        return b.localeCompare(a);

    }


}
