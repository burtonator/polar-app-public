module.exports = function(config) {
    config.set({

        frameworks: ["karma-typescript"],

        files: [
            { pattern: "src/**/*.ts" }
        ],

        preprocessors: {
            "src/**/*.ts": ["karma-typescript"]
        },

        reporters: ["karma-typescript"],

        browsers: ["ChromeHeadless"],

        singleRun: true
    });
};

