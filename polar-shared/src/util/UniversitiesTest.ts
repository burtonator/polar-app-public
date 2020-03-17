import {assert} from 'chai';
import {arrayStream} from "./ArrayStreams";
import {Universities, University} from "./Universities";
import {IDStr} from "./Strings";
import {Hashcodes} from "./Hashcodes";

describe('Universities', function() {

    xit("require unique", function() {

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

    it("require unique ID", function() {

        const dupes =
            arrayStream(Universities.get())
                .group(current => current.id)
                .filter(current => current.length > 1)
                .collect();

        console.log(JSON.stringify(dupes, null, '  '));
        assert.equal(dupes.length, 0);

    });


    it("add ID", function() {

        interface UniversityWithID extends University {
            readonly id: IDStr;
        }

        const toUniversityWithDomain = (university: University): UniversityWithID => {

            const id = Hashcodes.createID(university);

            return {...university, id};

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
