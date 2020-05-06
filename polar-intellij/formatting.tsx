// code to verify that IntelliJ properly formats my code.


interface IValue {
    readonly name: string;
    readonly address: string;
}

class Chain {
    public method1() {
        return this;
    }

    public method2() {
        return this;
    }
}

// method chaining.

new Chain().method1()
           .method2();

new Chain()
    .method1()
    .method2();

function secondFunction(value: IValue) {

}

function functionWithAlignedOptions(option1: string,
                                    option2: string,
                                    option3: string) {

}

functionWithAlignedOptions('hello',
                           'world',
                           'dog');

function myFunction(rowsPerPage: number) {

    // FIXME: this is currently broken
    secondFunction({
        name: 'alice',
        address: '123 fake street'
    });

}
