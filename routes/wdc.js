var Users = require('../models/users');

module.exports = function (mongoose){
    return {
        getApp: function(req, res){
            res.render('app');
        },

        getUser:  function(req, res){
            console.log("Req:", req.query, req.body, req.params, req.cookie);
            var userId = req.user? req.user._id : req.query.userId;
            console.log("ID", userId);
            if (userId){
                Users.findById(userId).exec()
                .then(user =>{
                    res.json(user);
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500);
                })
            } else {
                res.json({});
            }
        }
    }
}
