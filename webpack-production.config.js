var path = require("path");
var webpack = require("webpack");
var StripLoader = require("strip-loader");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: ["babel-polyfill", "./client/App.jsx"],

    output: {
        path: path.resolve(__dirname, "public/javascripts"),
        filename: "bundle.js",
        publicPath: "/javascripts"
    },

    devtool: 'cheap-module-source-map',

    module: {
        loaders: [
            {
                test: [/\.js$/, /\.jsx$/],
                include: path.resolve(__dirname, "client"),
                loader: 'babel-loader',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['stage-2', 'react', 'es2015'],
                }
            },

            {
                test: [/\.css$/, /\.scss$/],
                loader: ExtractTextPlugin.extract('style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader!postcss-loader')
            },


            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192&name=./public/images/[hash].[ext]'
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("../stylesheets/styles.css"),
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'NODE_ENV': JSON.stringify('production')
        //     }
        // }),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     comments: false,
        //     dropDebugger: true,
        //     dropConsole: true,minimize: true,
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],

    resolve: {
        root: path.join(__dirname, ''),
        modulesDirectories: [
            'node_modules',
        ],
        extensions: ['', '.js', '.jsx', 'css', '.scss']
    },

    postcss: [ autoprefixer({ browsers:['last 2 versions'] }) ]
}
