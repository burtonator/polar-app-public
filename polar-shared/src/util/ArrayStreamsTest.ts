import {arrayStream} from "./ArrayStreams";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('ArrayStreams', function() {

    it("flatMap", function() {

        assertJSON(arrayStream([1, 2, 3])
                   .map(current => [current, current])
                   .flatMap(current => current)
                   .collect(),
                   [1, 1, 2, 2, 3, 3]);

        assertJSON(arrayStream([[1, 2, 3]])
                   .flatMap(current => current)
                   .collect(),
                   [1, 2, 3]);

        assertJSON(arrayStream([[1],[2]])
                        .flatMap(current => current)
                        .collect(),
                   [1, 2]);

        assertJSON(arrayStream([[1, 2],[3]])
                .flatMap(current => current)
                .collect(),
            [1, 2, 3]);

    });

    it("filterPresent", function() {

        // make sure types compile right...
        const values: ReadonlyArray<number>
            = arrayStream([1, 2, 3, null, undefined])
                .filterPresent()
                .collect();

        assertJSON(values, [1, 2, 3])

    });

    it("flatMap typed", function() {

        interface Animal {
            name: string;
        }

        const animals: ReadonlyArray<ReadonlyArray<Animal>> = [
            [
                {name: 'cat'},
                {name: 'dog'}
            ],
            [
                {name: 'mouse'}
            ]
        ];

        const flatMapped: ReadonlyArray<Animal>
            = arrayStream(animals)
                .flatMap(current => current)
                .collect();

        assertJSON(flatMapped,
            [
                {
                    "name": "cat"
                },
                {
                    "name": "dog"
                },
                {
                    "name": "mouse"
                }
            ]);

    });

});
