module.exports = (config) => {
    config.set({
        browsers: ['ChromeHeadless'],
        frameworks: ['mocha'],
        files: [
            // all files ending in "_test"
            { pattern: 'src/*Test.ts', watched: false },
            { pattern: 'src/**/*Test.ts', watched: false },
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            // add webpack as preprocessor
            'src/*Test.ts': ['webpack'],
            'src/**/*Test.ts': ['webpack'],
        },

        webpack,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only',
        },
    });
};
