//NPM Modules
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var exphbs  = require("express-handlebars");
var favicon = require('express-favicon');

//get routes
var wdc  = require("./routes/wdc.js")();

//set up express
var app = express();

var PORT = process.env.PORT || 3000;

//If dev, hot module replacement
if(process.env.NODE_ENV !== "production"){
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackConfig = require('./webpack.config.js');
    var compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        hot: true,
        filename: "bundle.js",
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
        },
        historyApiFallback: true,
    }));

    app.use(require("webpack-hot-middleware")(compiler));
}

app.use(express.static(path.join(__dirname, "public")));
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({ secret: 'my_precious',
                  resave: true,
                  saveUninitialized: true,
                }));

//App Routes
app.get("/", wdc.getApp);

//Start Server
app.listen(PORT, function() {
    console.log("App running on port:", PORT);
});
