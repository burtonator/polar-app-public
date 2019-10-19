import {Resource} from "./Resource";
import {PHZWriter} from "./PHZWriter";

export interface PHZWritable {

    writeMetadata(metadata: any): Promise<PHZWriter>;

    writeResource(resource: Resource, content: string, comment?: string): Promise<PHZWriter>;

    close(): Promise<void>;

}
