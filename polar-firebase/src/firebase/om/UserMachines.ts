import {PlatformStr} from "polar-shared/src/util/Platforms";
import {MachineID} from "../../../../../polar-bookshelf/web/js/util/MachineIDs";
import {UserIDStr} from "../Collections";
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Version, VersionStr} from "polar-shared/src/util/Version";

export class UserMachines {

}

export class UserMachineInits {
    public static create() {
        const version = Version.get();
        // Platfor

    }
}

/**
 * Screen dimensions.
 */
export interface IScreen {
    readonly width: number;
    readonly height: number;
}

export interface UserMachineInit {
    readonly id: MachineID;
    readonly platform: PlatformStr;
    readonly version: VersionStr;
    readonly screen: IScreen;
}

export interface UserMachine extends UserMachineInit {
    readonly user_id: UserIDStr;
    readonly lastUpdated: ISODateTimeString;
    readonly created: ISODateTimeString;
}
