import {assert} from 'chai';
import {arrayStream} from "./ArrayStreams";
import {Universities, University} from "./Universities";

describe('Universities', function() {

    it("require unique", function() {

        const dupes =
            arrayStream(Universities.get())
                .group(current => current.name)
                .filter(current => current.length > 1)
                .collect();

        // FIXME: some of the domains are broken but not sure how many...
        // FIXME: I need a unique id for each record so we can reference them
        // properly

        for (const dupe of dupes) {
            const uniq = arrayStream(dupe)
                .unique(current => JSON.stringify(current, null, ' '))
                .collect();

            if (uniq.length !== 1) {
                console.log("failed: ", uniq);
            }

        }

        // console.log(dupes);

        assert.equal(dupes.length, 0);

    });

    xit("add domain", function() {

        interface UniversityWithDomain extends University {
            readonly domain: string;
        }

        const toUniversityWithDomain = (university: University): UniversityWithDomain => {

            const domain = university.domains[0];

            return {...university, domain};

        };

        const universities =
            arrayStream(Universities.get())
                .map(toUniversityWithDomain)
                .collect();

        for (const university of universities) {
            const tuple = Universities.toTuple(university);
            const tupleWithDomain = [...tuple];
            const json = JSON.stringify(tupleWithDomain);
            console.log(`${json},`);
        }

    });

    xit("sorted", function() {

        interface UniversityWithDomain extends University {
            readonly domain: string;
        }

        const toUniversityWithDomain = (university: University): UniversityWithDomain => {

            const domain = university.domains[0];

            return {...university, domain};

        };

        const universities =
            arrayStream(Universities.get())
                .map(toUniversityWithDomain)
                .collect();

        for (const university of universities) {
            const tuple = Universities.toTuple(university);
            const tupleWithDomain = [...tuple];
            const json = JSON.stringify(tupleWithDomain);
            console.log(`${json},`);
        }

    });


});
