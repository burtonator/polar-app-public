import {assert} from 'chai';
import {assertJSON} from "polar-test/src/test/Assertions";
import {DocPreviewURLs} from "./DocPreviewURLs";

describe('DocPreviewURLs', function() {

    it("parse", function() {

        assertJSON(DocPreviewURLs.parse('https://app.getpolarized.io/d/linux/this%20is%20about%20the%20linux%20kernel/0x12345'), {
            "id": "12345",
            "category": "linux",
            "slug": "this is about the linux kernel"
        });

        assertJSON(DocPreviewURLs.parse('https://app.getpolarized.io/d/this%20is%20about%20the%20linux%20kernel/0x12345'), {
            "id": "12345",
            "slug": "this is about the linux kernel",
            category: undefined
        });

        assertJSON(DocPreviewURLs.parse('https://app.getpolarized.io/d/0x12345'), {
            "id": "12345"
        });

    });


    it("canonicalize", function() {

        assert.equal(DocPreviewURLs.canonicalize('https://app.getpolarized.io/d/linux/this%20is%20about%20the%20linux%20kernel/0x12345'), '/d/:category/:slug/:id');
        assert.equal(DocPreviewURLs.canonicalize('https://app.getpolarized.io/d/this%20is%20about%20the%20linux%20kernel/0x12345'), '/d/:slug/:id');
        assert.equal(DocPreviewURLs.canonicalize('https://app.getpolarized.io/d/0x12345'), '/d/:id');

        assert.equal(DocPreviewURLs.canonicalize('/d/linux/this%20is%20about%20the%20linux%20kernel/0x12345'), '/d/:category/:slug/:id');
        assert.equal(DocPreviewURLs.canonicalize('/d/this%20is%20about%20the%20linux%20kernel/0x12345'), '/d/:slug/:id');
        assert.equal(DocPreviewURLs.canonicalize('/d/0x12345'), '/d/:id');

    });


    it("create", function() {

        assert.equal(DocPreviewURLs.create({
            id: '12345',
            category: undefined,
            title: undefined,
            slug: undefined
        }), "https://app.getpolarized.io/d/0x12345");

        assert.equal(DocPreviewURLs.create({
            id: '12345',
            title: 'hello world',
            category: undefined,
            slug: undefined
        }), 'https://app.getpolarized.io/d/hello%20world/0x12345');

        assert.equal(DocPreviewURLs.create({
            id: '12345',
            category: 'test',
            title: 'hello world',
            slug: undefined
        }), 'https://app.getpolarized.io/d/test/hello%20world/0x12345');

        assert.equal(DocPreviewURLs.create({
            id: '12345',
            category: 'test',
            title: 'hello world',
            slug: 'hello-world-now'
        }), 'https://app.getpolarized.io/d/test/hello-world-now/0x12345');

    });

});
