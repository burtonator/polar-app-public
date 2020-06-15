const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const mode = process.env.NODE_ENV || 'production';
const isDev = process.env.NODE_ENV === 'development';
const target = process.env.WEBPACK_TARGET || 'web';

const workers = require('os').cpus().length - 1;

console.log("Using N workers: " + workers);

module.exports = {
    mode,
    target: 'web',
    entry: {
        "popup": [ "./src/popup.ts"],
        "login": [ "./src/login.ts"],
        "content": [ "./src/content.ts"],
        "background": [ "./src/background.ts"],
    },
    module: {

        rules: [

            { loader: 'cache-loader' },
            {
                test: path.resolve(__dirname, 'node_modules/polar-bookshelf/node_modules/electron/index.js'),
                use: 'null-loader'
            },
            {
                test: /node_modules\/electron/,
                use: 'null-loader'
            },
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
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool: isDev ? "inline-source-map" : false,
    output: {
        path: path.resolve(__dirname),
        filename: 'dist/[name]-bundle.js',
        // publicPath: '/web/js/apps'
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        electron: 'empty',
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
    ],
    optimization: {
        // minimize: ! isDev,
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                output: { ascii_only: true },
            }})
        ],
        // usedExports: true,
        // removeAvailableModules: true,
        // removeEmptyChunks: true,
        // splitChunks: false,
    }
};
