
export interface MutableILTRect {
    left: number;
    top: number;
    width: number;
    height: number;
}

/**
 * A left/top rect.
 */
export interface ILTRect extends Readonly<MutableILTRect> {

}

