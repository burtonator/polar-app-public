import {AuthHandlers} from "polar-bookshelf/web/js/apps/repository/auth_handler/AuthHandler";

async function handleAsync() {

    // FIXME: firebase MAY NOT work here because there's no .html page to
    // inject it with.

    const authHandler = AuthHandlers.get();

    // make sure that we can authenticate properly
    await authHandler.requireAuthentication();

}

handleAsync()
    .catch(err => console.error(err));
