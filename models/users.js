var mongoose = require("mongoose") ;

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var usersSchema = mongoose.Schema({
    name: String,
    fbId: String,
    feed: {}
});

usersSchema.statics.findOrCreate = function (findParams, userData){
    return new Promise((resolve, reject) =>{
        this.find(findParams, (err, users) =>{
            if (err) {reject(err)}
            else {
                if (users.length === 0){
                    var newUser = new this(Object.assign(userData, findParams))
                    resolve(newUser.save())
                } else if (users.length === 1){
                    resolve(users[0])
                } else {
                    reject(new Error("Multiple objects meet find criteria"))
                }
            }
        })
    })
}

usersSchema.statics.verifyAndCreate = function (findParams, userData){
    return new Promise((resolve, reject) =>{
        this.find(findParams, (err, users) =>{
            if (err) {reject(err)}
            else {
                if (users.length === 0){
                    var newUser = new this(Object.assign(userData, findParams))
                    resolve(newUser.save())
                } else {
                    reject(new Error("User already Exists"))
                }
            }
        })
    })
}

module.exports = mongoose.model('User', usersSchema);
