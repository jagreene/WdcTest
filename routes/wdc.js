
module.exports = function (){
    return {
        getApp: function(req, res){
            res.render('app');
        },

        getUser:  function(req, res){
            console.log(req.user);
            console.log(req.session);
            res.json(req.user || {});
        }
    }
}
