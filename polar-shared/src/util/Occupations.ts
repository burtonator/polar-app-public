import {toIdentifier} from "./Identifiers";

export type OccupationType = 'academic' | 'business';
export const academicOccupations = [
    "College Student",
    "Grad Student",
    "Researcher",
    "Professor",
];
export const businessOccupations = [
    "Corporate Researcher",
    "Software Engineer",
    "Mathematician",
    "Data Scientist",
    // "Web Designer",
    "Founder",
    "Investor",
    "Other"
];

export interface AcademicOccupation {
    readonly id: string;
    readonly type: 'academic';
    readonly name: string;
}

export interface BusinessOccupation {
    readonly id: string;
    readonly type: 'business';
    readonly name: string;
}

export type Occupation = AcademicOccupation | BusinessOccupation;

export class Occupations {

    public static academicFromName(name: string): AcademicOccupation {
        return {
            id: toIdentifier(name),
            type: 'academic',
            name
        };
    }

    public static businessFromName(name: string): BusinessOccupation {
        name = name.trim();
        return {
            id: toIdentifier(name),
            type: 'business',
            name
        };
    }

    // public static

}
