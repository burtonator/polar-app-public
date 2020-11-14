export namespace NumberComparators {

    type Order = 'asc' | 'desc';

    export function create(a: number, b: number, order: Order): number {

        switch (order) {
            case "asc":
                return ascending(a, b);
            case "desc":
                return descending(a, b);
        }
    }

    export function ascending(a: number, b: number) {
        return a - b;
    }

    export function descending(a: number, b: number) {
        return b - a;
    }

}