import {assert} from 'chai';

export namespace Assertions {

    export async function assertAsyncThrows(delegate: () => Promise<void>) {

        try {
            await delegate();
            assert.isTrue(false, "Delegate didn't fail");
        } catch {
            /// we're good ..
        }

    }

}
