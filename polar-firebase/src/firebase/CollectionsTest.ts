import {assertJSON} from "polar-test/src/test/Assertions";
import {FirestoreArray, FirestoreDict} from "./Collections";

describe('Collections', function() {

    it('array types', () => {

        const arr0: FirestoreArray = [
            'asdf'
        ];

        assertJSON(arr0, ['asdf']);

        const arr1: FirestoreArray = {
            1: 'asdf'
        };

        assertJSON(arr1, ['asdf']);

        interface MyArray<T> extends ReadonlyArray<T> {

        }

        interface MyDict {
            readonly [key: number]: string;
        }

        const bar0: string[] = ['foo'];
        const bar1: MyArray<string> = ['foo'];
        const bar2: MyDict = ['foo'];

        bar0.includes('foo');
        bar1.includes('foo');

        // NOTE: this should NOT compile
        // bar2.includes('foo');

    });


    it("basic", function() {
        const dict: FirestoreDict = {
            foo: 'bar',
            cat: {
                dog: '123',
                bird: 1,
                kitten: false,
                puppy: [
                    {
                        dog: {
                            kitty: 'cat'
                        }
                    }
                ]

            }
        };

        interface Cat {
            readonly name: string;
            readonly legs: number;
        }

        const cat: Cat = {
            name: 'monster',
            legs: 4
        };

        const cat0: FirestoreDict = {
            name: 'monster',
            legs: 4
        };

        // const myCat: Cat = cat0;
        // const MyCat0: FirestoreDict = cat;

        interface MyFoo {
            name: string;
        }

        type T1 = keyof MyFoo;

        // interface MyInterface {
        //     [foo: T1]: MyFoo
        // }
        //

        type Partial<T> = {
            [P in keyof T]: string;
        };

        // interface StringDict {
        //     [key: string]: number | string | boolean;
        // }
        //
        // interface MyDict<T extends StringDict> {
        //     [key: keyof T]: any;
        // }

    });

});
