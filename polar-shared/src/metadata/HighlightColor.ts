/**
 * Older colors by name
 */
import {AlphaChannel} from "../util/Colors";


export type NamedColor = 'yellow' | 'red' | 'green' | 'blue' | 'transparent';

/**
 * RGB colors as #FFFFFF or #000000
 */
export type RGBStr = string;

/**
 * An rgba CSS string like rgba(0, 0, 0, 0.5)
 */
export type RGBAStr = string;

export type BackgroundColor = RGBAStr | 'transparent';

export class HighlightColors {

    public static withDefaultColor(value: NamedColor | RGBStr | undefined | null) {

        if (! value) {
            return 'yellow';
        }

        return value;

    }

    /**
     * Convert to our standard background color for text highlights.
     *
     */
    public static toBackgroundColor(value: NamedColor | RGBStr | undefined | null,
                                    alpha: AlphaChannel = 0.7): BackgroundColor {

        value = this.withDefaultColor(value);

        switch (value) {

            case 'transparent':
                return 'transparent';

            case 'yellow':
                return `rgba(255, 255, 0, ${alpha})`;

            case 'red':
                return `rgba(255, 0, 0, ${alpha})`;

            case 'green':
                return `rgba(0, 255, 0, ${alpha})`;

            case 'blue':
                return `rgba(0, 0, 255, ${alpha})`;

            default:
                return this.toRGBA(value, alpha);

        }

    }

    /**
     * Convert a color like #FFFFFF to rgba
     */
    public static toRGBA(value: RGBStr, alpha: AlphaChannel) {

        const toInt = (str: string) => {
            return parseInt(str, 16);
        };

        const s0 = value.substring(1, 3);
        const s1 = value.substring(3, 5);
        const s2 = value.substring(5, 7);

        const n0 = toInt(s0);
        const n1 = toInt(s1);
        const n2 = toInt(s2);

        return `rgba(${n0}, ${n1}, ${n2}, ${alpha})`;

    }

}
