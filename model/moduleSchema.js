var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var localSchema  =new Schema({
    title:String,
    description:String,
    project:{type: Schema.Types.ObjectId,ref:'project'},
    user:{type: Schema.Types.ObjectId, ref:'users'}
});
module.exports=mongoose.model("module",localSchema);
