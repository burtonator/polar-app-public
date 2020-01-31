import {assert, expect} from 'chai';
import {Dates} from './Dates';
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

xdescribe("dateUtils", () => {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    // describe("diffDays", () => {
    //     it("it should return the difference of two dates", () => {
    //         expect(Dates.diffDays(today, oneDayAgo)).to.equal(1);
    //         expect(Dates.diffDays(today, oneWeekAgo)).to.equal(7);
    //         expect(Dates.diffDays(today, twoDaysInFuture)).to.equal(-2);
    //         expect(Dates.diffDays(today, twoWeeksInFuture)).to.equal(-14);
    //     });
    // });
    //
    // describe("addDays", () => {
    //     it("it should add a given number of days to a date", () => {
    //
    //         assert.equal(ISODateTimeStrings.create(), "2012-03-02T11:38:49.321Z");
    //         assert.equal(new Date().getTime(), 1330688329321);
    //
    //         expect(Dates.addDays(today, 2).getTime()).to.equal(twoDaysInFuture.getTime());
    //         expect(Dates.addDays(today, 14).getTime()).to.equal(twoWeeksInFuture.getTime());
    //     });
    // });
    //
    // describe("addDays", () => {
    //     it("it should subtract a given number of days from a date", () => {
    //         expect(Dates.subtractDays(today, 1).getTime()).to.equal(oneDayAgo.getTime());
    //         expect(Dates.subtractDays(today, 7).getTime()).to.equal(oneWeekAgo.getTime());
    //     });
    // });
});
