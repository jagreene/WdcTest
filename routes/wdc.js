
module.exports = function (){
    return {
        getApp: function(req, res){
            res.render('app');
        },

        getUser:  function(req, res){
            res.json(req.user || {});
        }
    }
}
