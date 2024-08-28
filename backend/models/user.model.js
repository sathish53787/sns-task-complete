const mongoose = require('mongoose')

const UserSchema =  mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    password:{type:String},
    email:{type:String},
    phone:{type:Number},
    role:{type:String}
})

module.exports = mongoose.model("User",UserSchema);