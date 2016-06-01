var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: ["webpack-hot-middleware/client", "babel-polyfill", "./client/App.jsx"],

    output: {
        path: path.resolve(__dirname, "public/javascripts"),
        filename: "bundle.js",
        publicPath: "/javascripts"
    },

    devtool: 'eval',

    module: {
        loaders: [
        {
            test: [/\.js$/, /\.jsx$/],
            include: path.resolve(__dirname, "client"),
            loader: 'babel-loader',
            query: {
                plugins: ['transform-runtime'],
                presets: ['stage-2', 'react', 'es2015', 'react-hmre'],
            }
          },

          {
            test: [/\.css$/, /\.scss$/],
            loaders: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass-loader', 'postcss-loader']
          },

          {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192&name=./public/images/[hash].[ext]'
          }
        ]
    },

    resolve: {
        root: path.join(__dirname, ''),
        modulesDirectories: [
            'node_modules',
        ],
        extensions: ['', '.js', '.jsx', 'css', '.scss']
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            'Promise': 'es6-promise', // Thanks Aaron (https://gist.github.com/Couto/b29676dd1ab8714a818f#gistcomment-1584602)
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],

    postcss: [ autoprefixer({ browsers:['last 2 versions'] }) ]
}
