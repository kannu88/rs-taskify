var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
    name:String,
    email:String,
    profilePicture:String,
    phoneNo:Number,
    password:String,
    age:String,
    DOB:Date,
    views:{type:Number,default:0}
});

module.exports= mongoose.model("users",localSchema);

