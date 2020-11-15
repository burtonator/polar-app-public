import {Numbers} from "./Numbers";

export namespace Domains {

    /**
     * Given a domain, compute all potential subdomains including the TLD
     *
     * example.com could be parsed as
     *
     * ['example.com', 'com']
     *
     * foo.example.com
     *
     * would be parsed as
     *
     * ['foo.example.com', 'example.com', 'com']
     *
     */
    export function computeAllSubdomains(domain: string) {

        const subdomains = domain.split('.');

        function toDomainRange(start: number) {
            const sublist = subdomains.slice(start, subdomains.length);
            return sublist.join(".");
        }

        return Numbers.range(0, subdomains.length - 1)
            .map(start => toDomainRange(start))

    }

}