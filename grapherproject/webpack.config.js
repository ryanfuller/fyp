const path = require('path');

module.exports = {
    entry: './StartScript.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
        ]
    },
    // watch: true,
    watchOptions: {
        ignored: '/node_modules/',
        poll: 1000 // Check for changes every second, Docker on Windows...
    }
};