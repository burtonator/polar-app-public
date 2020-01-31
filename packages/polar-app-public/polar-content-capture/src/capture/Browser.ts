// borrowed from Electron
export interface Point {

    // Docs: http://electronjs.org/docs/api/structures/point

    x: number;
    y: number;
}

// borrowed from Electron
export interface Size {

    // Docs: http://electronjs.org/docs/api/structures/size

    height: number;
    width: number;
}

// borrowed from Electron
export interface DeviceEmulation {
    /**
     * Specify the screen type to emulate (default: desktop):
     */
    screenPosition: ('desktop' | 'mobile');
    /**
     * Set the emulated screen size (screenPosition == mobile).
     */
    screenSize: Size;
    /**
     * Position the view on the screen (screenPosition == mobile) (default: { x: 0, y:
     * 0 }).
     */
    viewPosition: Point;
    /**
     * Set the device scale factor (if zero defaults to original device scale factor)
     * (default: 0).
     */
    deviceScaleFactor: number;
    /**
     * Set the emulated view size (empty means no override)
     */
    viewSize: Size;
    /**
     * Scale of emulated view inside available space (not in fit to view mode)
     * (default: 1).
     */
    scale: number;
}

export class Browser implements Readonly<IBrowser> {

    public readonly name: string;

    public readonly title: string;

    public readonly type: BrowserType;

    public readonly description: string;

    public readonly userAgent: string;

    public readonly deviceEmulation: DeviceEmulation;

    public readonly inactive: boolean = false;

    /**
     *
     * @param opts
     */
    constructor(opts: IBrowser) {
        this.name = opts.name;
        this.title = opts.title;
        this.type = opts.type;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
    }

}

export interface IBrowser {

    name: string;

    title: string;

    type: BrowserType;

    description: string;

    userAgent: string;

    deviceEmulation: DeviceEmulation;

    /**
     * True if this is currently inactive for user selection.  IE just a test
     * profile.
     */
    inactive: boolean;

}

export type BrowserType = 'desktop' | 'tablet' | 'phone';
