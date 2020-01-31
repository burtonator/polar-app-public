import path from "path";

/**
 * Very similar to FileRegistry but we store path to files and the backing
 * file on disk.
 */
export class ResourceRegistry {

    /**
     * The registry of file paths and resources to serve.
     */
    private readonly registry: {[appPath: string]: string} = {};

    /**
     *
     */
    public register(appPath: AppPath, filePath: FilePath): void {

        filePath = path.resolve(filePath);
        this.registry[appPath] = filePath;

    }

    public contains(appPath: AppPath) {
        return appPath in this.registry;
    }

    public get(appPath: string): FilePath {

        if (!this.contains(appPath)) {
            throw new Error("Not registered: " + appPath);
        }

        return this.registry[appPath];

    }

}

/**
 * The full path to load the file in the webapp.
 */
export type AppPath = string;

/**
 * The full path to a local file.
 */
export type FilePath = string;
