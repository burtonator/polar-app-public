export namespace Identity {

    export async function getAuthToken() {

        return new Promise<string>((resolve, reject) => {

            try {

                if (! chrome) {
                    throw new Error('no chrome');
                }

                if (! chrome.identity) {
                    throw new Error('no chrome.identity');
                }

                chrome.identity.getAuthToken({'interactive': true}, function (token) {
                    resolve(token);
                });


            } catch (e) {
                reject(e);
            }

        })


    }

}
