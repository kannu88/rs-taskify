var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var localSchema  =new Schema({
    title:String,
    description:String,
    projectId:String
});
module.exports=mongoose.model("module",localSchema);
