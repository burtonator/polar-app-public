const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const os = require('os');
const fs = require('fs');

const isDev = false;
const target = 'electron-main';
const devtool = 'cheap-module-source-map';

const workers = os.cpus().length - 1;

const OUTPUT_PATH = path.resolve(__dirname);

console.log("Using N workers: " + workers);
console.log("isDev: " + isDev);
console.log("WEBPACK_TARGET: " + target);
console.log("WEBPACK_DEVTOOL: " + devtool);
console.log("Running in directory: " + __dirname);
console.log("Writing to output path: " + OUTPUT_PATH);

module.exports = {
    mode: 'production',
    // stats: 'verbose',
    target,
    entry: {
        "main": "./src/main.ts",
        "debug": "./src/debug.ts",
    },
    module: {
        rules: [

            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: '.webpack-cache-loader'
                }
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'thread-loader',
                        options: {
                            // there should be 1 cpu for the fork-ts-checker-webpack-plugin
                            workers,
                            // set this to Infinity in watch mode - see https://github.com/webpack-contrib/thread-loader
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

            },

        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
        }
    },
    devtool,
    output: {
        path: OUTPUT_PATH,
        filename: '[name]-bundle.js',
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({}),
    ].filter(Boolean),
    optimization: {
        minimize: false,
    },
    watchOptions: {
    },
};
