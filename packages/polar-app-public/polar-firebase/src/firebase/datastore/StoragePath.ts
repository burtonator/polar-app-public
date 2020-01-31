import {StorageSettings} from "./StorageSettings";

export interface StoragePath {
    readonly path: string;
    readonly settings?: StorageSettings;
}
