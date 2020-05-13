export namespace ValueProvider {

    export interface IValueProvider<V> {
        readonly set: (value: V) => void;
        readonly get: () => V;
    }

    export function create<V>(value: V): IValueProvider<V> {

        function set(newValue: V) {
            value = newValue;
        }

        function get() {
            return value;
        }

        return {set, get};

    }

}
