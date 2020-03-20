import {toIdentifier} from "./Identifiers";

export type OccupationType = 'academic' | 'business';
export const academicOccupations = [
    "Student",
    "Researcher",
    "Professor",
    "Teacher",
    "Lecturer",
    "Librarian",
];
export const businessOccupations = [
    "Software Engineer",
    "Mathematician",
    "Web Designer",
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
