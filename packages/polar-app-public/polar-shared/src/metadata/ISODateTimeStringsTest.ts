import {assert} from 'chai';
import {ISODateTimeStrings} from "./ISODateTimeStrings";
import {Arrays} from "../util/Arrays";
import {assertJSON} from "polar-test/src/test/Assertions";
import {TestingTime} from "../test/TestingTime";

describe('ISODateTimeStrings', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it("basic", function() {
        assert.equal(ISODateTimeStrings.parse("2019-11-11T08:00:00.000-08:00").toISOString(), "2019-11-11T16:00:00.000Z" );
    });

    it("compare with sort", function() {

        const values = ["2019-12-11T16:00:00.000Z", "2019-11-11T16:00:00.000Z" , "2019-10-11T16:00:00.000Z"];

        const parsed = values.map(current => Date.parse(current));

        assertJSON(parsed, [
            1576080000000,
            1573488000000,
            1570809600000
        ]);

        const sorted = Arrays.shuffle(...values)
                             .sort((a, b) => ISODateTimeStrings.compare(a, b));

        assertJSON(sorted, [
            "2019-10-11T16:00:00.000Z",
            "2019-11-11T16:00:00.000Z",
            "2019-12-11T16:00:00.000Z"
        ]);

    });

    it("compare", function() {
        assert.equal(ISODateTimeStrings.compare("2019-11-11T16:00:00.000Z", "2019-12-11T16:00:00.000Z"), -2592000000);
    });

    it("compare", function() {

        const now = new Date();

        assert.equal(ISODateTimeStrings.toPartialDay(now), '2012-03-02');
        assert.equal(ISODateTimeStrings.toPartialWeek(now), '2012W9');
        assert.equal(ISODateTimeStrings.toPartialMonth(now), '2012-03');

    });



});
