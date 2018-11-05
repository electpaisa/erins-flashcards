// not gonna lie, stole this from:
// https://www.codementor.io/tamizhvendan/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack-du107r9zr

const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '');
const APP_DIR = path.resolve(__dirname, 'app');

var config = {
    target: 'electron-renderer',
    entry: APP_DIR + '/app.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    module : {
        rules: [
            {
                test : /\.jsx?/,
                exclude: /node_modules/,
                include: APP_DIR,
                use : {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
            }
        ]
    }
};

module.exports = config;