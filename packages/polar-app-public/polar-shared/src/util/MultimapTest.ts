import {assertJSON} from 'polar-test/src/test/Assertions';
import {ArrayListMultimap} from "./Multimap";

describe('Multimap', function() {

    it("same value", function() {

        const multimap = new ArrayListMultimap<string, string>();
        multimap.put('foo', 'bar');

        assertJSON(multimap.keys(), ['foo']);

        multimap.delete('foo');

        assertJSON(multimap.keys(), []);

    });


    it("delete specific keys with a function", function() {

        const multimap = new ArrayListMultimap<string, string>();
        multimap.put('foo', 'bar');
        multimap.put('foo', 'cat');

        assertJSON(multimap.keys(), ['foo']);

        assertJSON(multimap.get('foo'), ['bar', 'cat']);

        multimap.delete('foo', undefined, (val: string) => val === 'cat');

        assertJSON(multimap.get('foo'), ['bar']);

    });

});
