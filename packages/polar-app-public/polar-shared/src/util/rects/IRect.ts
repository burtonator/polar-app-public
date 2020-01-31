export interface MutableIRect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    width: number;
    height: number;
}

export interface IRect extends Readonly<MutableIRect> {
}
