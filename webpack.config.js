// not gonna lie, stole this from:
// https://www.codementor.io/tamizhvendan/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack-du107r9zr

const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '');
const APP_DIR = path.resolve(__dirname, 'app');

module.exports = env => {
    var target = env && env.web ? 'web' : 'electron-renderer';
    return {
        target : target,
        mode: "development",
        entry: APP_DIR + '/app.jsx',
        devtool: 'source-map',
        output: {
            path: BUILD_DIR,
            filename: 'bundle.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            }),
        ],
        module : {
            rules: [
                {
                    test : /\.jsx?/,
                    resolve: {
                        extensions: ['.js', '.jsx'],
                    },
                    exclude: /node_modules/,
                    include: APP_DIR,
                    use : {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                }
            ]
        },
        devServer: {
            port: 3000
        }
    };
};