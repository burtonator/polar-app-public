import {Image} from './Images';
import {TagStr} from "polar-shared/src/tags/Tags";
import {PlainTextStr, URLStr} from "polar-shared/src/util/Strings";

export interface ProfileInit {

    /**
     * The name of the user.
     */
    readonly name?: string;

    /**
     * The image of the user from their profile.  We can also cache this on our
     * own so this is the URL metadata we prefer.
     */
    readonly image?: Image;

    /**
     * The user handle of this profile.  A unique name for this account that's
     * a global reference for this user like 'alice101' or 'burtonator'.
     */
    readonly handle?: HandleStr;

    /**
     * User entered bio for their profile.  This is text explaining
     */
    readonly bio?: PlainTextStr;

    /**
     * Allow the user to pick at most 5 tags for their profile so people could
     * search for them by tag..
     */
    readonly tags?: ReadonlyArray<TagStr>;

    /**
     * Links for the user (their Twitter account, Facebook profile, etc).
     */
    readonly links?: ReadonlyArray<URLStr>;

    /**
     * The physical location for the user.
     */
    readonly location?: string;

    //
    //
    // readonly fieldOfStudy?: FieldOfStudy;
    //
    // readonly university?: University;

}

export interface Profile extends ProfileInit {
    readonly id: ProfileIDStr;
}

export type ProfileIDStr = string;

export type HandleStr = string;

export type UserIDStr = string;

export type EmailStr = string;

export interface ProfileIDRecord {
    readonly profileID?: ProfileIDStr;
}

export type ProfileRecordTuple<T> = [T, Profile | undefined];

