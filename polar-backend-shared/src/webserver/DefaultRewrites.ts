import {Rewrite} from "polar-shared-webserver/src/webserver/Rewrites";

export class DefaultRewrites {

    public static create(): ReadonlyArray<Rewrite> {

        // TODO: for now the source is a regular expression.  Make it into
        // the same slug format that ReactRouter uses in the future.

        return [
            {
                "source": [
                    "/",
                    "/index.html",
                    "/plans",
                    "/plans-year",
                    "/stats",
                    "/annotations",
                    "/invite",
                    "/whats-new",
                    "/logout",
                    "/login",
                    "/sign-in",
                    "/create-account",
                    "/feature-requests",
                    "/login.html",
                    "/logs",
                    "/configured",
                    "/invite",
                    "/premium",
                    "/account",
                    "/settings",
                    "/profile",
                    "/device",
                    "/error",
                ],
                "destination": "/apps/repository/index.html"
            },
            {
                "source": [
                    "/d/:category/:title/:hashcode",
                    "/d/:title/:hashcode",
                    "/d/:hashcode",
                ],
                "destination": "/apps/preview/index.html"
            },

            {
                "source": [
                    "/doc",
                    "/doc/:id",
                    "/doc/:id/:title",
                    "/apps/doc/:id",
                ],
                "destination": "/apps/repository/index.html"
            },

            {
                "source": "/group/:group/highlights",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/group/:group/docs",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/group/:group/highlight/:id",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/group/:group",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/groups",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/groups/create",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/user/:user",
                "destination": "/apps/repository/index.html"
            },
            {
                "source": "/logout.html",
                "destination": "/apps/repository/logout.html"
            },
            {
                "source": "/apps/stories/**",
                "destination": "/apps/stories/index.html"
            },
            {
                "source": "/pdfjsWorker-bundle.js",
                "destination": "/web/dist/pdfjsWorker-bundle.js"
            }
        ];

    }

}
