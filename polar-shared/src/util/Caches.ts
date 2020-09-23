export namespace Caches {

    export async function test() {

        // we can stick a raw blob as a response with the constructor
        const cache = await caches.open('test1');

        // headers , status and statusText can be specified
        // new Response(blob, {})
        // await cache.put(request, response
        // )

        // we can put it into the cache, then redirect the user to the home doc page, then pop up a task bar

    }

}