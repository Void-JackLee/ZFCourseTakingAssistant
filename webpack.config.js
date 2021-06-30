//
//  webpack.config.js
//  抢课助手
//
//  Created by 李弘辰 on 2021/6/24.
//  Copyright © 2021 李弘辰. All rights reserved.
//  Learn more on website https://void-lee.cn
//
//  This program is free software; you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation; either version 2 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License along
//  with this program; if not, write to the Free Software Foundation, Inc.,
//  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//

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