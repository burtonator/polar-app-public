import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import {Objects} from "./Objects";

describe('Objects', function() {

    describe('defaults', function () {

        it("with no current", function () {

            let value = Objects.defaults(null, {hello: "world"});

            assertJSON(value, {hello: "world"});

        });

        it("with no value", function () {

            let value = Objects.defaults({}, {hello: "world"});

            assertJSON(value, {hello: "world"});

        });

        it("with existing", function () {

            let value = Objects.defaults({ hello: "buddy"}, {hello: "world"});

            assertJSON(value, {hello: "buddy"});

        });

    });


    describe('clear', function () {

        it("clear dictionary", function () {

            let myDict = {
                hello: "world"
            };

            Objects.clear(myDict);

            assertJSON(myDict, {});

        });

        it("clear array", function () {

            let myArr = [
                "world"
            ];

            Objects.clear(myArr);

            assertJSON(myArr, []);

        });

    });

    describe('createInstance', function () {

        class Address {

            public readonly city: string;
            public readonly state: string;
            public readonly zip: number;

            constructor(city: string, state: string, zip: number) {
                this.city = city;
                this.state = state;
                this.zip = zip;
            }

        }

        class Animal {

        }

        it("using generics", function () {

            let myDict = {
                city: "San Francisco",
                state: "CA",
                zip: 94107
            };

            function myFunc(address: Address) {

            }

            let animal = new Animal();
            //myFunc(animal);

            //myFunc();

            // Using Class Types in Generics
            // When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions. For example,
            //
            //     function create<T>(c: {new(): T; }): T {
            //         return new c();
            //     }
            // A more advanced example uses the prototype property to infer and constrain relationships between the constructor function and the instance side of class types.
            //
            //

            // FIXME: this should fail!
            // let address = Objects.createInstance(Animal.prototype, myDict);
            // myFunc(address);

            // class Foo {
            //
            //     private constructor(val: any) {
            //     }
            //
            // }
            //
            // function create<T>(typeConstructor: new(val: any) => T ): T {
            //     return new typeConstructor({});
            // }
            //
            // let address=  create(Foo);

            // function createInstance<T>(t: T, val: any) {
            //     let result: T = create(prototype);
            //     return val;
            // }
            //
            // let val: string = createInstance(Address, {});
            //
            // Address.constructor


        });

        it("should not compile", function () {

            function create<T>(proto: any): T {
                return Object.create(proto);
            }

            function createInstance<T>(prototype: T, val: any) {
                let result: T = create(prototype);
                return val;
            }

            let val: string = createInstance(Address.prototype, {});
        });


    });


});
