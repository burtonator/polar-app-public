const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const workers = require('os').cpus().length - 1;

console.log("Using N workers: " + workers);

module.exports = {
    // mode: 'development',
    entry: {
        "popup": [ "./src/popup.ts"],
        "content": [ "./src/content.ts"],
        "background": [ "./src/background.ts"],
    },
    module: {

        rules: [

            { loader: 'cache-loader' },
            {
                test: path.resolve(__dirname, 'node_modules/electron/index.js'),
                use: 'null-loader'
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,

                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers: 15,
                            // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
                            poolTimeout: Infinity,
                            workerParallelJobs: 100,
                            poolTimeout: 2000,
                        }
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            // performance: this improved performance by about 2x.
                            // from 20s to about 10s
                            transpileOnly: true,
                            experimentalWatchApi: true,

                            // IMPORTANT! use happyPackMode mode to speed-up
                            // compilation and reduce errors reported to webpack
                            happyPackMode: true

                        }
                    }

                ]

            }

        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            // TODO: this is used temporarily during our migration to using
            // webpack everywhere.  We should eventually change our import to
            // just 'firebase' but FB think's it's running in node and executes
            // with the wrong strategy.
            // N
            './lib/firebase': path.resolve(__dirname, 'node_modules/polar-bookshelf/node_modules/firebase')
        }
    },
    // devtool: "source-map",
    // devtool: "inline-source-map",
    output: {
        path: path.resolve(__dirname),
        filename: 'dist/[name]-bundle.js',
        // publicPath: '/web/js/apps'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
    ],
    optimization: {
        minimize: true,
        usedExports: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        splitChunks: false,
    }
};
