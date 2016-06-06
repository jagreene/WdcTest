var Users = require('../models/users');

module.exports = function (mongoose){
    return {
        getApp: function(req, res){
            res.render('app');
        },

        getUser:  function(req, res){
            var userId = req.user._id || req.query.userId
            if (userId){
                Users.findById(userId).exec()
                .then(user =>{
                    res.json(user);
                })
                .catch(err=>{
                    console.log(err)
                    res.status(500);
                })
            } else {
                res.json({});
            }
        }
    }
}
