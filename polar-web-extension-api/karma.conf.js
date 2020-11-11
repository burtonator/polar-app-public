var webpackConfig = require("./webpack.config");

module.exports = function (config) {
  config.set({
    basePath: "",
    plugins: [
      'karma-chrome-launcher',
      //'karma-webpack' // *** This 'registers' the Karma webpack plugin.
      'karma-mocha',
    ],
    frameworks: ["mocha"],
    files: ["dist/bundle.js"],
    exclude: [],
    preprocessors: {
      //"src/*.ts": ["webpack"]
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.DEBUG,
    autoWatch: false,
    browsers: ["Chrome"],
    singleRun: false,
    concurrency: Infinity,
    browserNoActivityTimeout: 500000
  });
};