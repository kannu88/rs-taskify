var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
email:String,
otp:Number
    
});

module.exports= mongoose.model("forgotPassword",localSchema);
