var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var localSchema = new Schema({
    name:String,
    email:{ 
        type: String, 
        index: true, 
        unique: true, 
        required: true },
    profilePicture:String,
    phoneNo:Number,
    password:String,
    age:String,
    DOB:Date,
    views:{type:Number,default:0}
});
localSchema.plugin(uniqueValidator);
module.exports= mongoose.model("users",localSchema);

