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

        await doc.set(heartbeat);

    }

    public static create(uid: UserIDStr | undefined): HeartbeatsInit {

        const id = Hashcodes.createRandomID();
        const created = ISODateTimeStrings.create();
        const platform = Platforms.toSymbol(Platforms.get())
        const machine = MachineIDs.get();
        const version = Version.get();
        const runtime = AppRuntime.get();

        return {
            id, created, uid, platform, machine, version, runtime
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
     * The user UD that generated this heartbeat.
     */
    readonly uid: UserIDStr | undefined;

    /**
     * The user's platform .
     */
    readonly platform: PlatformStr;

    readonly machine: MachineID;

    readonly version: VersionStr;

    readonly runtime: AppRuntimeID;

}

export interface Heartbeat extends HeartbeatsInit {
}
