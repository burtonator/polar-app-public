import {assert} from 'chai';
import {ISODateTimeStrings} from "./ISODateTimeStrings";

describe('ISODateTimeStrings', function() {

    it("basic", function() {
        assert.equal(ISODateTimeStrings.parse("2019-11-11T08:00:00.000-08:00").toISOString(), "2019-11-11T16:00:00.000Z" );

    });

});
