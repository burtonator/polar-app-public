import {Emails} from "./Emails";
import {assert} from 'chai';

describe("Emails", () => {

    it("basic", function () {

        assert.equal(Emails.toDomain('alice@example.com'), 'example.com');

        assert.isUndefined(Emails.toDomain('alice'));

    });

});
