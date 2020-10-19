export namespace Nonces {

    /**
     * Create a simple factory that generates a new nonce each time.  The nonces here are simple and not global nonces
     * but specific to the factor
     */
    export function createFactory(): () => number {

        let nonce = 0;

        return () => {
            return nonce++;
        };

    }

}