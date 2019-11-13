import {DATA} from "./UniversitiesData";

export type TwoLetterCountryCode = string;
export type DomainNameStr = string;

export interface Country {
    readonly code: TwoLetterCountryCode;
    readonly name: string;
}

export interface DomainNameToUniversityMap {
    [name: string]: University;
}


export interface University {
    readonly name: string;
    readonly domains: ReadonlyArray<DomainNameStr>;
    readonly country: Country;
}

function createUniversities(): ReadonlyArray<University> {

    const toUniversity = (uni: any): University => {
        const name = uni[0];
        const domains = uni[1];
        const countryCode = uni[2];
        const countryName = uni[3];

        return {
            name, domains,
            country: {
                code: countryCode,
                name: countryName
            }
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


export class Universities {

    public static get() {
        return universities;
    }

    public static getByDomain(domain: DomainNameStr): University | undefined {
        return domainNameToUniversityMap[domain] || undefined;
    }

}



