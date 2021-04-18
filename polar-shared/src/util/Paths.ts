import {isPresent} from '../Preconditions';

export class Paths {

    /**
     * Create a path from the given parts regardless of their structure.
     *
     * Don't allow double // or trailing /.  The output is always sane.
     *
     * @param dirname
     * @param basename
     */
    public static create(dirname: string, basename: string) {

        if (! isPresent(dirname)) {
            throw new Error("Dirname required");
        }

        if (! isPresent(basename)) {
            throw new Error("Basename required");
        }

        if (dirname.indexOf("//") !== -1 || basename.indexOf("//") !== -1  ) {
            // don't allow // in dirname already as we would corrupt
            throw new Error("No // in dirname");
        }

        let result = dirname + "/" + basename;

        // replace multiple slashes in directory parts
        result = result.replace(/\/\/+/g, "/");

        // remove any trailing slashes
        result = result.replace(/\/$/g, "");

        return result;

    }

    public static join(a: string, b: string): string {
        return this.create(a, b);
    }

    /**
     * Return the last portion of the path.
     *
     */
    public static basename(data: string): string {
        return this.splitPath(data)[2];
    }

    /**
     * Return the dirname part of a path
     *
     */
    public static dirname(data: string): string {
        const parts = Paths.splitPath(data);
        const root = parts[0];
        let dir = parts[1];

        if (!root && !dir) {
            return ".";
        }

        if (dir) {
            dir = dir.substr(0, dir.length - 1);
        }

        return root + dir;
    }

    private static splitPath(a: string): string[] {
        const pathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return pathRe.exec(a)!.slice(1); // This will never be null
    }
}
