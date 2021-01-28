export namespace Locations {

    export interface ILocation {
        readonly origin: string;
        readonly protocol: string;
        readonly hostname: string;
        readonly pathname: string;
        readonly port: string;
        readonly hash: string;
        readonly search: string;
    }

    export function merge(a: ILocation, b: Partial<ILocation>): ILocation {
        return {
            origin: b.origin || a.origin,
            protocol: b.protocol || a.protocol,
            hostname: b.hostname || a.hostname,
            pathname: b.pathname || a.pathname,
            port: b.port || a.port,
            hash: b.hash || a.hash,
            search: b.search || a.search
        }
    }

    /**
     * Compute a location to a string.
     */
    export function toString(location: ILocation) {
        const relative = toRelative(location);
        return `${location.origin}${relative}`;
    }

    export function toRelative(location: ILocation) {

        // document.location.hash in the URL always has the hash param... but
        // not including it will add it.

        function withPrefix(val: string, prefix: string) {

            if (val.trim() === '') {
                return val;
            }

            if (val.startsWith(prefix)) {
                return val;
            } else {
                return prefix + val;
            }
        }

        function toHash(val: string) {
            return withPrefix(val, '#');
        }

        function toSearch(val: string) {
            return withPrefix(val, '?');
        }

        const search = toSearch(location.search);

        const hash = toHash(location.hash);

        return `${location.pathname}${search}${hash}`;

    }

}
