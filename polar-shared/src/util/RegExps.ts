export class RegExps {

    public static escape(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

}

export type RegexStr = string;
