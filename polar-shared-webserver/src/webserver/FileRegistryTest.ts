import {WebserverConfig} from './WebserverConfig';

import {assert} from 'chai';
import {FileRegistry} from './FileRegistry';
import {Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {assertJSON} from "polar-test/src/test/Assertions";

const webserverConfig = new WebserverConfig(".", 8080);

describe('FileRegistry', function() {

    describe('create', function() {

        it("basic", async function() {

            const fileRegistry = new FileRegistry(webserverConfig);

            assert.equal(fileRegistry.hasKey("0x0001"), false);

            const path = FilePaths.tmpfile('file-registry.html');
            await Files.writeFileAsync(path, 'hello world');

            const registerData = fileRegistry.register("0x0001", path);

            const expected = {
                "key": "0x0001",
                "filename": path,
                "url": "http://127.0.0.1:8080/files/0x0001"
            };

            assertJSON(registerData, expected);

            assert.equal(fileRegistry.hasKey("0x0001"), true);

        });

        it("register with PHZ", async function() {
            const fileRegistry = new FileRegistry(webserverConfig);

            const path = "/home/burton/.polar/stash/12EEqbAeuX-YC_s_Essential_Startup_Advice.phz";

            const filename = FilePaths.basename(path);

            const fileMeta = fileRegistry.register(path, filename);

            console.log(fileMeta);

        });

    });

});
