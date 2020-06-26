module.exports = (config) => {
    config.set({
        // browsers: ['Chrome'],
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

        webpack: {
            // karma watches the test entry points
            // (you don't need to specify the entry option)
            // webpack watches dependencies
            // webpack configuration
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only',
        },
    });
};
