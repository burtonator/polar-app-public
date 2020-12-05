import {
    CollectionNameStr,
    Collections,
    FirestoreProvider,
    UserIDStr
} from "../Collections";
import {
    ISODateTimeString,
    ISODateTimeStrings
} from "polar-shared/src/metadata/ISODateTimeStrings";
import {Version, VersionStr} from "polar-shared/src/util/Version";
import {IDStr} from "polar-shared/src/util/Strings";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {MachineID, MachineIDs} from "polar-shared/src/util/MachineIDs";
import {AppRuntime, AppRuntimeID} from "polar-shared/src/util/AppRuntime";
import {PlatformStr, Platforms} from "polar-shared/src/util/Platforms";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {Device, Devices} from "polar-shared/src/util/Devices";

export class Heartbeats {

    public static firestoreProvider: FirestoreProvider;

    private static COLLECTION: CollectionNameStr = "heartbeat";

    private static collections() {
        return new Collections(this.firestoreProvider(), this.COLLECTION);
    }

    public static async write(uid: UserIDStr | undefined) {

        const heartbeat = this.create(uid);

        const firestore = this.firestoreProvider();

        const doc = firestore.collection(this.COLLECTION)
                             .doc(heartbeat.id);

        await doc.set(Dictionaries.onlyDefinedProperties(heartbeat));

    }

    public static create(uid: UserIDStr | undefined): HeartbeatsInit {

        const id = Hashcodes.createRandomID();
        const created = ISODateTimeStrings.create();
        const machine = MachineIDs.get();

        const platform = Platforms.toSymbol(Platforms.get());
        const version = Version.get();
        const runtime = AppRuntime.get();
        const device = Devices.get();

        return {
            id, created, uid, platform, machine, version, runtime, device
        };

    }

}

export interface HeartbeatsInit {

    /**
     * The UD created which is just a random / unique ID
     */
    readonly id: IDStr;

    /**
     * When this heartbeat was created and written to the database.
     */
    readonly created: ISODateTimeString;

    /**
     * The user ID that generated this heartbeat.
     */
    readonly uid: UserIDStr | undefined;

    /**
     * The user's platform.
     */
    readonly platform: PlatformStr;

    readonly machine: MachineID;

    readonly version: VersionStr;

    readonly runtime: AppRuntimeID;

    /**
     * phone/tablet/desktop
     */
    readonly device: Device;
}

export interface Heartbeat extends HeartbeatsInit {
}
