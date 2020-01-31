
import {assert} from 'chai';
import {URLs} from './URLs';

describe('URLs', function() {

    it("toBase", function() {

        assert.equal(URLs.toBase('http://www.example.com/foo/bar'), 'http://www.example.com');
        assert.equal(URLs.toBase('http://www.example.com:80/foo/bar'), 'http://www.example.com');
        assert.equal(URLs.toBase('http://www.example.com:1234/foo/bar'), 'http://www.example.com:1234');
        assert.equal(URLs.toBase('https://www.example.com:443/foo/bar'), 'https://www.example.com');

    });

    it('absolute', function() {
        assert.equal(URLs.absolute('foo/index.html', 'http://www.example.com'), "http://www.example.com/foo/index.html");
        assert.equal(URLs.absolute('/foo/index.html', 'http://www.example.com'), "http://www.example.com/foo/index.html");
        assert.equal(URLs.absolute('./foo/index.html', 'http://www.example.com'), "http://www.example.com/foo/index.html");
        assert.equal(URLs.absolute('#hello', 'http://www.example.com'), "http://www.example.com/#hello");
    });

    it('always absolute', function() {
        assert.equal(URLs.absolute('/group/linux', 'https://app.getpolarized.io'), "https://app.getpolarized.io/group/linux");
        assert.equal(URLs.absolute('https://app.getpolarized.io/group/linux', 'https://app.getpolarized.io'), "https://app.getpolarized.io/group/linux");
    });

    it("different site", function() {
        assert.equal(URLs.absolute('http://www.cnn.com', 'https://app.getpolarized.io'), "http://www.cnn.com/");
    });

    it("pathname", function() {
        assert.equal(URLs.pathname('/'), "/");
        assert.equal(URLs.pathname('/foo'), "/foo");
        assert.equal(URLs.pathname('http://www.example.com/'), "/");
        assert.equal(URLs.pathname('http://www.example.com/foo'), "/foo");
        assert.equal(URLs.pathname('https://www.example.com/'), "/");
        assert.equal(URLs.pathname('https://www.example.com/foo'), "/foo");
        assert.equal(URLs.pathname('https://www.example.com'), "/");
    });

    // TODO: this SHOULD work but it was breaking other code.
    // it('absolute between different sites', function() {
    //     assert.equal(URLs.absolute('http://www.microsoft.com', 'http://www.example.com'), "http://www.example.com");
    // });

});
