import {SetMultimap} from "./SetMultimap";
import {assertJSON} from "polar-test/src/test/Assertions";

interface Person {
    readonly name: string;
}

const keyToKeyFunction = (value: string) => value;

const valueToKeyFunction = (value: Person) => value.name;

describe('SetMultimap', function() {

    it("basic", function() {

        const sut = new SetMultimap(keyToKeyFunction, valueToKeyFunction);

        sut.put('colorado', {name: 'kayla'});
        sut.put('colorado', {name: 'kevin'});

        assertJSON(sut.get('colorado'), [
            {
                "name": "kayla"
            },
            {
                "name": "kevin"
            }
        ]);

        sut.filter('colorado', value => value.name !== 'kevin');

        assertJSON(sut.get('colorado'), [
            {
                "name": "kayla"
            },
        ]);

    });

});
