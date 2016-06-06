var request = require('request-promise');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(mongoose, passport){
    // Configure the Facebook strategy for use by Passport.
    passport.use('facebook-signup', new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        enableProof: true,
        callbackURL: '/signup/facebook/callback'},
        function(accessToken, refreshToken, profile, done){
            var user = {name: profile.diplayName};
            var reqOptions = {
                uri: `https://graph.facebook.com/v2.5/${profile.id}/feed`,
                    qs: {
                    type: "normal",
                    redirect: false,
                    access_token: accessToken
                },
                json: true
            };
            request(reqOptions)
            .then(feedData =>{
                user.feed = feedData.data;
                return Promise.all(user.feed.map((post) =>{
                    var reqOptions = {
                        uri: `https://graph.facebook.com/v2.5/${post.id}/likes`,
                            qs: {
                            access_token: accessToken
                        },
                        json: true
                    };
                    return request(reqOptions);
                }))
            })
            .then(likeData =>{
                user.feed = user.feed.map((post, idx)=>{
                    return Object.assign({}, post, {likes:likeData[idx].data.length});
                })
                return Users.verifyAndCreate({fbId: profile.id}, user)
            })
            .then(user =>{
                return done(null, user);
            })
            .catch(err =>{
                console.log(err);
                return done(err, false)
            })
        })
    )

    //Serialize user into session cookie
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    //Deserialize user from session cookie
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

}
