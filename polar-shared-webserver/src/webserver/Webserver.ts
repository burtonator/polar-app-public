import {WebserverConfig} from './WebserverConfig';
import {FileRegistry} from './FileRegistry';
import {Logger} from 'polar-shared/src/logger/Logger';
import {Preconditions} from 'polar-shared/src/Preconditions';
import {Paths} from 'polar-shared/src/util/Paths';
import express, {Express, NextFunction, Request, RequestHandler, Response} from 'express';
import serveStatic from 'serve-static';
import {ResourceRegistry} from './ResourceRegistry';
import * as http from "http";
import * as https from "https";
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Rewrite, Rewrites} from "./Rewrites";
import {PathToRegexps} from "polar-shared/src/url/PathToRegexps";
import {PathParams} from 'express-serve-static-core';
import {PathStr} from 'polar-shared/src/util/Strings';

const log = Logger.create();

const STATIC_CACHE_MAX_AGE = 365 * 24 * 60 * 60;

/**
 * Start a simple static HTTP server only listening on localhost
 */
export class Webserver implements WebRequestHandler {

    private readonly webserverConfig: WebserverConfig;
    private readonly fileRegistry: FileRegistry;
    private readonly resourceRegistry: ResourceRegistry;

    private app?: Express;

    private server?: http.Server | https.Server;

    constructor(webserverConfig: WebserverConfig,
                fileRegistry: FileRegistry,
                resourceRegistry: ResourceRegistry = new ResourceRegistry()) {

        this.webserverConfig = Preconditions.assertPresent(webserverConfig, "webserverConfig");
        this.fileRegistry = Preconditions.assertPresent(fileRegistry, "fileRegistry");
        this.resourceRegistry = resourceRegistry;

    }

    public async start(): Promise<void> {

        log.info("Running with config: ", this.webserverConfig);

        express.static.mime.define({ 'text/html': ['chtml'] });

        this.app = Webserver.createApp(this.webserverConfig.dir, this.webserverConfig.rewrites);

        // FIXME: move this to the first and LAST aapp.use so we can see how it was actually handled?
        const requestLogger = (req: Request, res: Response, next: NextFunction) => {
            console.info(`${req.method} ${req.url}`);
            console.info(req.headers);
            console.info();
            console.info('====');
            next();
        };


        // this.app.use(requestLogger);

        this.registerFilesHandler();
        this.registerResourcesHandler();

        if (this.webserverConfig.useSSL) {

            Preconditions.assertPresent(this.webserverConfig.ssl, "No SSLConfig");

            const sslConfig = {
                key: this.webserverConfig.ssl!.key,
                cert: this.webserverConfig.ssl!.cert
            };

            this.server =
                https.createServer(sslConfig, this.app)
                    .listen(this.webserverConfig.port, this.webserverConfig.host);

        } else {

            this.server =
                http.createServer(this.app)
                    .listen(this.webserverConfig.port, this.webserverConfig.host);

        }

        // await for listening...

        return new Promise<void>(resolve => {
            this.server!.once('listening', () => resolve());
        });

        // log.info(`Webserver up and running on port
        // ${this.webserverConfig.port} with config: `, this.webserverConfig);

    }

    /**
     * Create an express app that can be used with our server..
     */
    public static createApp(dir: PathStr,
                            rewrites: ReadonlyArray<Rewrite> = [],
                            app: Express = express()): Express {

        // handle rewrites FIRST so that we can send URLs to the right destination
        // before all other handlers.
        this.registerRewrites(app, rewrites);

        app.use((req, res, next) => {

            next();

            if (req.path && req.path.endsWith('woff2')) {
                res.set({ 'Cache-Control': `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable` });
            }

        });

        app.use(serveStatic(dir, {immutable: true}));

        for (const page of ['login.html', 'index.html']) {

            // handle explicit paths of /login.html and /index.html like we
            // do in the webapp.

            const pagePath = FilePaths.join(dir, 'apps', 'repository', page);

            app.use(`/${page}`, serveStatic(pagePath, {immutable: true}) as any);

        }

        app.use(express.json());
        app.use(express.urlencoded());

        return app;

    }

    public stop() {

        log.info("Stopping...");
        this.server!.close();
        log.info("Stopping...done");
    }

    public get(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.get(type, ...handlers);
    }

    public options(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.options(type, ...handlers);
    }

    public post(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.post(type, ...handlers);
    }

    public put(type: PathParams, ...handlers: RequestHandler[]): void {
        this.app!.put(type, ...handlers);
    }

    private registerFilesHandler() {

        this.app!.get(/files\/.*/, (req: express.Request, res: express.Response) => {

            try {

                log.info("Handling file at path: " + req.path);

                const hashcode = Paths.basename(req.path);

                if (!hashcode) {
                    const msg = "No key given for /file";
                    log.error(msg);
                    res.status(404).send(msg);
                } else if (!this.fileRegistry.hasKey(hashcode)) {
                    const msg = "File not found with hashcode: " + hashcode;
                    log.error(msg);
                    res.status(404).send(msg);
                } else {

                    const keyMeta = this.fileRegistry.get(hashcode);
                    const filename = keyMeta.filename;

                    log.info(`Serving file at ${req.path} from ${filename}`);

                    return res.sendFile(filename);

                }

            } catch (e) {
                log.error(`Could not handle serving file. (req.path=${req.path})`, e);
            }

        });

    }

    private registerResourcesHandler() {

        this.app!.get(/.*/, (req: express.Request, res: express.Response) => {

            try {

                log.info("Handling resource at path: " + req.path);

                if (!this.resourceRegistry.contains(req.path)) {
                    const msg = "Resource not found: " + req.path;
                    log.error(msg);
                    res.status(404).send(msg);
                } else {

                    const filePath = this.resourceRegistry.get(req.path);
                    return res.sendFile(filePath);

                }

            } catch (e) {
                log.error(`Could not handle serving file. (req.path=${req.path})`, e);
            }

        });

    }

    private static registerRewrites(app: Express, rewrites: ReadonlyArray<Rewrite> = []) {

        const computeRewrite = (url: string): Rewrite | undefined => {

            for (const rewrite of rewrites) {

                // console.debug("Testing with rewrite: ", rewrite);

                // TODO: it's probably not efficient to build this regex each
                // time

                const sources = Rewrites.toSources(rewrite);

                for (const source of sources) {
                    const regex = PathToRegexps.pathToRegexp(source);

                    const matches = Rewrites.matchesRegex(regex, url);

                    // console.debug(`Compiled as regexp: ${regex} matches: ${matches}`);

                    if (matches) {
                        return rewrite;
                    }

                }

            }

            return undefined;

        };

        app.use(function(req, res, next) {

            const handler = async () => {

                // log.debug("Rewrite at url: " + req.url);

                const rewrite = computeRewrite(req.url);

                // console.debug(`URL ${req.url} rewritten as `, rewrite);

                if (rewrite) {

                    if (typeof rewrite.destination === 'string') {
                        req.url = rewrite.destination;
                    } else {
                        const url = req.url;
                        const content = await rewrite.destination(url);
                        res.send(content);
                    }

                }

                next();

            };

            handler().catch(err => console.error(err));

        });

    }

}


export type ExpressRequestHandler = (req: express.Request, res: express.Response) => void;

export interface WebRequestHandler {

    get(type: PathParams, ...handlers: ExpressRequestHandler[]): void;
    options(type: PathParams, ...handlers: ExpressRequestHandler[]): void;
    post(type: PathParams, ...handlers: ExpressRequestHandler[]): void;
    put(type: PathParams, ...handlers: ExpressRequestHandler[]): void;

}
