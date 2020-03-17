import {Platforms, PlatformStr} from "polar-shared/src/util/Platforms";
import {CollectionNameStr, Collections, FirestoreProvider, UserIDStr} from "../Collections";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Version, VersionStr} from "polar-shared/src/util/Version";
import {MachineID, MachineIDs} from "polar-shared/src/util/MachineIDs";

export class UserMachines {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "user_machine";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async update() {

    }

}

export class UserMachineInits {

    public static create(): UserMachineInit {
        const id = MachineIDs.get();
        const version = Version.get();
        const platform = Platforms.toSymbol(Platforms.get());
        const screen = {
            width: window.screen.width,
            height: window.screen.height
        };

        const rev = 'v1';

        return {id, version, platform, screen, rev};

    }

}

/**
 * Screen dimensions.
 */
export interface IScreen {
    readonly width: number;
    readonly height: number;
}

export type RevType = 'v1';

export interface UserMachineInit {

    readonly id: MachineID;

    /**
     * The revision of this object type so we can change over time.
     */
    readonly rev: RevType;
    readonly platform: PlatformStr;
    readonly version: VersionStr;
    readonly screen: IScreen;
}

export interface UserMachine extends UserMachineInit {
    readonly user_id: UserIDStr;
    readonly lastUpdated: ISODateTimeString;
    readonly created: ISODateTimeString;
}
