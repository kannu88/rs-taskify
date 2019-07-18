var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
    name:String,
    email:String,
    phoneNo:Number,
    companyName:String,
    user:{type: Schema.Types.ObjectId, ref:'users'}
});

module.exports = mongoose.model("clients",localSchema);