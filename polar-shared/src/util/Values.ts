export namespace Values {

    /**
     * Given a value, verify that it's within the accepted value list, and if
     * if not return the default value.
     */
    export function accept<T extends number | string>(value: T,
                                                      accepted: ReadonlyArray<T>,
                                                      defaultValue: T): T {
        return value;
    }

}
