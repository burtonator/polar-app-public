export namespace HashURLs {

    export interface ILocationWithHash {
        readonly hash?: string;
    }

    export type QueryOrLocation = string | ILocationWithHash;

    export function parse(queryOrLocation: QueryOrLocation): URLSearchParams {

        function toQuery() {

            if (typeof queryOrLocation === 'string') {
                return queryOrLocation;
            }

            return queryOrLocation.hash || ''

        }

        function tokenize(query: string) {

            if (query.startsWith('#')) {
                return query.substring(1);
            }

            return query;

        }

        const query = toQuery();

        return new URLSearchParams(tokenize(query));

    }

}
