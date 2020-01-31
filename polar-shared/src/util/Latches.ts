import {Latch} from "./Latch";

export class Latches {

    public static resolved<T>(value: T) {
        const latch = new Latch<T>();
        latch.resolve(value);
        return latch;
    }

}
