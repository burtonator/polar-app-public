import {assert} from 'chai';
import {Paths} from './Paths';

describe('Paths', function() {

    describe('create()', function() {

        it("no dirname", function () {

            assert.throws(function () {
                Paths.create(null!, "subdir");
            })

        });

        it("no basename", function () {

            assert.throws(function () {
                Paths.create("/", null!);
            })

        });

        it("no trailing /", function () {
            assert.equal(Paths.create("/", "first/"), "/first");
        });

        it("two basic paths", function () {
            assert.equal(Paths.create("/", "first"), "/first");
        });

        it("two leading slashes", function () {
            assert.equal(Paths.create("/", "/first"), "/first");
        });

        it("two leading and one trailing slash", function () {
            assert.equal(Paths.create("/cat/", "/dog"), "/cat/dog");
        });

        it("four slashes", function () {
            assert.equal(Paths.create("/cat/", "/dog/"), "/cat/dog");
        });

    });


    describe('join()', function() {

        it("no dirname", function () {

            assert.throws(function () {
                Paths.join(null!, "subdir");
            })

        });

        it("no basename", function () {

            assert.throws(function () {
                Paths.join("/", null!);
            })

        });

        it("two basic paths", function () {
            assert.equal(Paths.join("/", "first"), "/first");
        });

        it("two leading slashes", function () {
            assert.equal(Paths.join("/", "/first"), "/first");
        });

        it("two leading and one trailing slash", function () {
            assert.equal(Paths.join("/cat/", "/dog"), "/cat/dog");
        });

        it("four slashes", function () {
            assert.equal(Paths.join("/cat/", "/dog/"), "/cat/dog");
        });

        xit("too many slashes", function () {
            assert.equal(Paths.join("/cat//", "//dog/"), "/cat/dog");
        });

    });


    describe('basename', function() {
        it("Should work with empty strings", function () {
            assert.equal(Paths.basename(""), "");
        });

        it("basic", function () {
            assert.equal(Paths.basename("hello"), "hello");
        });

        it("basic", function () {
            assert.equal(Paths.basename("/files/0x000"), "0x000");
        });

        it("trailing slash", function () {
            assert.equal(Paths.basename("/files/0x000/"), "0x000");
        });

    });

    describe("dirname", () => {
        it("Should work with empty strings", () => {
            assert.equal(Paths.dirname("."), ".");
        });

        it("Should work with paths that only have one section", () => {
            assert.equal(Paths.dirname("/foo"), "/");
        });

        it("Should work with 2 parts", () => {
            assert.equal(Paths.dirname("/foo/world.foo"), "/foo");
            assert.equal(Paths.dirname("/foo////world"), "/foo///");
        });

        it("Random", () => {
            assert.equal(Paths.dirname("/foo/bar/baz/potato//"), "/foo/bar/baz");
            assert.equal(Paths.dirname("/foo/bar/baz/potato///wot.txt"), "/foo/bar/baz/potato//");
        });
    });
});
