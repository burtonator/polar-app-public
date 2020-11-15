import {EmailStr} from "./Strings";

export namespace Emails {

    export function toDomain(email: EmailStr): string | undefined {

        if (! email) {
            return undefined;
        }

        const parts = email.split('@');

        if (parts.length === 2) {
            return parts[1];
        }

        return undefined;

    }

}
