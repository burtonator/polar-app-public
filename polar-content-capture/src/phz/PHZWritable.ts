import {Resource} from "./Resource";

export interface PHZWritable {

    writeMetadata(metadata: any): Promise<void>;

    writeResource(resource: Resource, content: string, comment?: string): Promise<void>;

    close(): Promise<void>;

}
