const webpack = require('webpack');

module.exports = {
    entry: "./src/main.js",
    output: {
        path: __dirname,
        filename: "dist.js"
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [{
                        loader: "style-loader"
                    },{
                        loader: "css-loader"
                }]
            }]
    }
};