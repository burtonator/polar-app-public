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

        const timestamp = ISODateTimeStrings.create();
        const interval = ISODateTimeStrings.toISODateStringRoundedToHour(timestamp);

        // tslint:disable-next-line:variable-name
        const machine_id = MachineIDs.get();

        const id = Hashcodes.create({machine_id, interval});

        const version = Version.get();

        return {id, machine_id, version, interval, timestamp, uid};

    }

}

export interface HeartbeatsInit {

    readonly id: IDStr;

    readonly machine_id: MachineID;

    readonly version: VersionStr;

    /**
     * The rounded time interval (hour) that this event happened.
     */
    readonly interval: ISODateTimeString;

    /**
     * The actual timestamp that this happened.
     */
    readonly timestamp: ISODateTimeString;

    /**
     * The optional UID that generated this heartbeat.
     */
    readonly uid?: UserIDStr;

}

export interface Heartbeat extends HeartbeatsInit {
}
