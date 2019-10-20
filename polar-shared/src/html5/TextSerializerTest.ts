import {assert} from 'chai';
import {TextSerializer} from "./TextSerializer";

describe('TextSerializer', function() {

    it("basic", function() {

        assert.equal(TextSerializer.serialize("test"), "test");

        assert.equal(TextSerializer.serialize("test<script>console.log('asdf');</script>"), "test");

        assert.equal(TextSerializer.serialize("this <b>is</b> a <i>test</i>"), "this is a test");

    });

});
