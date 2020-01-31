
export type RGBComponent = number;

export class RGB {

    constructor(readonly red: RGBComponent,
                readonly green: RGBComponent,
                readonly blue: RGBComponent) {

    }

    /**
     * Convert this to a CSS value.
     */
    public toCSS() {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }


}

export class RGBs {

    public static create(red: RGBComponent, green: RGBComponent, blue: RGBComponent): RGB {
        return new RGB(red, green, blue);
    }

}

export class RGBA extends RGB {

    constructor(readonly red: RGBComponent,
                readonly green: RGBComponent,
                readonly blue: RGBComponent,
                readonly alpha: AlphaChannel) {
        super(red, green, blue);
    }

    /**
     * Convert this to a CSS value.
     */
    public toCSS() {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
    }

}

export class RGBAs {
    public static create(red: RGBComponent, green: RGBComponent, blue: RGBComponent, alpha: AlphaChannel): RGBA {
        return new RGBA(red, green, blue, alpha);
    }
}

/**
 * Alpha channel as [0.0, 1.0]
 */
export type AlphaChannel = number;
