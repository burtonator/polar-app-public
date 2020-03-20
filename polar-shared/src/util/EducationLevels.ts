export interface EducationLevel {
    readonly id: string;
    readonly name: string;
}

export const educationLevels: ReadonlyArray<EducationLevel> = [
    {
        id: 'highschool',
        name: "High School"
    },
    {
        id: 'bachelors',
        name: "Bachelors"
    },
    {
        id: "masters",
        name: "Masters"
    },
    {
        id: "doctorate",
        name: "Doctorate / PhD"
    },
    {
        id: "postdoctorate",
        name: "Postdoctorate"
    },
    {
        id: "other",
        name: "Other"
    },
];
