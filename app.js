//NPM Modules
var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var exphbs  = require("express-handlebars");
var favicon = require('express-favicon');
var passport = require("passport");

//get routes
var wdc  = require("./routes/wdc.js")();

// configure auth
var auth =  require("./auth")(passport);

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
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.get("/api/user", wdc.getUser);

// Auth Routes
app.get('/signup/facebook',
    passport.authenticate('facebook-signup',{scope: ['user_posts']})
);

app.get('/signup/facebook/callback',
    passport.authenticate('facebook-signup', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
    }
);

//App Routes
app.get("/", wdc.getApp);
// app.get("/", ensureAuthenticated, wdc.getApp);

//Start Server
app.listen(PORT, function() {
    console.log("App running on port:", PORT);
});

//make sure user is authed before getting to data connector
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signup/facebook')
}
