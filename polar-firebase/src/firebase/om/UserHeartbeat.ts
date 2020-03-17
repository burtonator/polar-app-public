import {Platforms, PlatformStr} from "polar-shared/src/util/Platforms";
import {
    CollectionNameStr,
    Collections,
    FirestoreProvider,
    UserIDStr
} from "../Collections";
import {IDStr} from "polar-shared/src/util/Strings";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {MachineID, MachineIDs} from "polar-shared/src/util/MachineIDs";
import {Version, VersionStr} from "polar-shared/src/util/Version";

export class UserHeartbeats {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "user_heartbeat";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static create(uid: UserIDStr): UserHeartbeat {

        const id = Hashcodes.createRandomID();
        const created = ISODateTimeStrings.create();
        const platform = Platforms.toSymbol(Platforms.get())
        const machine = MachineIDs.get();
        const version = Version.get();

        return {
            id, created, uid, platform, machine, version
        };

    }

}

export interface UserHeartbeat {

    /**
     * The UD created which is just a random / unique ID
     */
    readonly id: IDStr;

    /**
     * When this heartbeat was created and written to the database.
     */
    readonly created: ISODateTimeString;

    /**
     * The user UD that generated this heartbeat.
     */
    readonly uid: UserIDStr | undefined;

    /**
     * The user's platform .
     */
    readonly platform: PlatformStr;

    readonly machine: MachineID;

    readonly version: VersionStr;

    // TODO we should add the appRuntimeType BUT we can't because it requires
    // electron ...

}
