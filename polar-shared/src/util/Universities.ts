import {DATA} from "./UniversitiesData";
import {IDStr} from "./Strings";

export type CountryNameStr = string;
export type TwoLetterCountryCode = string;
export type DomainNameStr = string;

export interface Country {
    readonly code: TwoLetterCountryCode;
    readonly name: CountryNameStr;
}

export interface DomainNameToUniversityMap {
    [name: string]: University;
}

export type UniversityName = string;
export type UniversityDomain = DomainNameStr;
export type UniversityDomains = ReadonlyArray<UniversityDomain>;

export type UniversityTuple = [
    UniversityName,
    UniversityDomains,
    TwoLetterCountryCode,
    CountryNameStr,
    UniversityDomain,
    IDStr
];


export interface University {
    readonly name: string;
    readonly domains: ReadonlyArray<DomainNameStr>;
    readonly country: Country;
    readonly domain: string;
    readonly id: IDStr;
}

function createUniversities(): ReadonlyArray<University> {

    const toUniversity = (uni: any): University => {
        const name = uni[0];
        const domains = uni[1];
        const countryCode = uni[2];
        const countryName = uni[3];
        const domain = uni[4];
        const id = uni[5];

        return {
            name, domains,
            country: {
                code: countryCode,
                name: countryName
            },
            domain,
            id
        };

    };

    return DATA.map(toUniversity);

}

function createUniversitiesMap(university: ReadonlyArray<University>): DomainNameToUniversityMap {
    const result: DomainNameToUniversityMap = {};

    for (const uni of university) {
        for (const domain of uni.domains) {
            result[domain] = uni;
        }
    }

    return result;

}

const universities = createUniversities();
const domainNameToUniversityMap = createUniversitiesMap(universities);

export namespace Universities {

    export function get() {
        return universities;
    }

    export function getByDomain(domain: DomainNameStr): University | undefined {
        return domainNameToUniversityMap[domain] || undefined;
    }

    export function toTupleJSON(university: University) {
        const tuple = toTuple(university);
        return JSON.stringify(tuple);
    }

    export function toTuple(university: University): UniversityTuple {

        return [
            university.name,
            university.domains,
            university.country.code,
            university.country.name,
            university.domain,
            university.id
        ];

    }


}



