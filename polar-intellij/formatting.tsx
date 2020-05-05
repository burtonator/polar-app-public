// code to verify that IntelliJ properly formats my code.


interface IValue {
    readonly name: string;
    readonly address: string;
}

function secondFunction(value: IValue) {

}

function functionWithAlignedOptions(option1: string,
                                    option2: string,
                                    option3: string) {

}

function myFunction(rowsPerPage: number) {

    // FIXME: this is currently broken
    secondFunction({
        name: 'alice',
        address: '123 fake street'
    });

}
