var mongoose = require('mongoose')
var Schema  = mongoose.Schema;
var localSchema = new Schema({
    title:String,
    description:String,
    status:String,
    assigning:String,
    creator:String,
    watchlist:String,
    priority:Number,
    projectId:String,
    moduleId:String,
    commentId:String,
    tags:String,
    clientId:String

})

module.exports=mongoose.model("task",localSchema);