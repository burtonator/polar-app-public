const path = require('path');
const webpack = require('webpack');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const svgToMiniDataURI = require('mini-svg-data-uri');

const mode = process.env.NODE_ENV || 'production';
const isDev = process.env.NODE_ENV === 'development';
const target = process.env.WEBPACK_TARGET || 'web';
const devtool = isDev ? "inline-source-map" : "source-map";
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

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

            {
                loader: 'cache-loader',
                options: {
                    cacheDirectory: '.webpack-cache-loader'
                }
            },
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

            },
            {
                // all image and font assets including SVG, TTFs and an optional
                // v=xxx identifier at the end if we want to use one.
                test: /\.(png|jpe?g|gif|bmp|ico|webp|woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[contenthash].[ext]',
                            outputPath: 'assets',
                            publicPath: '/assets'
                        }
                    },
                ],
            },
            {
                // make SVGs use data URLs.
                test: /\.(svg)(\?v=\d+\.\d+\.\d+)?$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 32768,
                            generator: (content) => svgToMiniDataURI(content.toString()),
                        }
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },

        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        fallback: {
            fs: false,
            net: false,
            tls: false,
        }
    },
    devtool,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]-bundle.js',
        // publicPath: '/web/js/apps'
    },
    plugins: [
        new NodePolyfillPlugin(),
        // new BundleAnalyzerPlugin(),
        new ForkTsCheckerWebpackPlugin({}),
        new CopyPlugin({
            patterns: [
                // this is a bit of a hack and it would be better if we supported
                // this better and managed as part of the build system
                { from: '../../../node_modules/pdfjs-dist/cmaps', to: './pdfjs-dist/cmaps' },
                { from: '../../../node_modules/pdfjs-dist/build/pdf.worker.js', to: './pdfjs-dist' }
            ],
        }),
    ],
    optimization: {
        // minimize: ! isDev,
        minimize: true,
        minimizer: [new TerserPlugin({
            // disable caching to:  node_modules/.cache/terser-webpack-plugin/
            // because intellij will index this data and lock up my machine
            // and generally waste space and CPU
            // cache: ".terser-webpack-plugin",
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
