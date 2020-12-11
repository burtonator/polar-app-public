import {toIdentifier} from "./Identifiers";

export const fieldsOfStudy = [
    "Agricultural and Biological Sciences",
    "Arts and Humanities",
    "Biochemistry, Genetics and Molecular Biology",
    "Business, Management and Accounting",
    "Chemical Engineering",
    "Chemistry",
    "Computer Science",
    "Data Science",
    "Decision Sciences",
    "Design",
    "Earth and Planetary Sciences",
    "Economics, Econometrics and Finance",
    "Energy",
    "Engineering",
    "Environmental Science",
    "Immunology and Microbiology",
    "Linguistics",
    "Materials Science",
    "Mathematics",
    "Medicine and Dentistry",
    "Neuroscience",
    "Nursing and Health Professions",
    "Pharmacology, Toxicology and Pharmaceutical Science",
    "Philosophy",
    "Physics and Astronomy",
    "Psychology",
    "Social Sciences",
    "Sports and Recreations",
    "Veterinary Science and Veterinary Medicine",
    "Other",
];

export interface FieldOfStudy {
    readonly id: string;
    readonly name: string;
}

export function toFieldOfStudy(name: string): FieldOfStudy {
    const id = toIdentifier(name);
    return {id, name};
}
