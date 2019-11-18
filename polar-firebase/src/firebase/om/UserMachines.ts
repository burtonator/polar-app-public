import {PlatformStr} from "polar-shared/src/util/Platforms";
import {MachineID} from "../../../../../polar-bookshelf/web/js/util/MachineIDs";
import {UserIDStr} from "../Collections";

export class UserMachines {

}

export interface UserMachineInit {
    readonly id: MachineID;
    readonly platform: PlatformStr;
}

export interface UserMachine {
    readonly user_id: UserIDStr;
}
