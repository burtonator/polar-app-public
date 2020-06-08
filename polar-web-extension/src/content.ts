import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";

import {Firebase} from "polar-bookshelf/web/js/firebase/Firebase";

async function handleAsync() {

    // FIXME: firebase MAY NOT work here because there's no .html page to
    // inject it with.

    const authHandler = AuthHandlers.get();

    // make sure that we are authenticated and if not authenticate us and
    // redirect back to the current URL
    await authHandler.requireAuthentication(document.location.href);
    // Firebase.init();


}

handleAsync()
    .catch(err => console.error(err));
