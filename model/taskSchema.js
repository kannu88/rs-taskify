var mongoose = require('mongoose')
var Schema  = mongoose.Schema;
var localSchema = new Schema({
    title:String,
    description:String,
    status:String,
    assigning:String,
    creator:String,
    watchlist:String,
    priority:String,
    commentId:String,
    tags:String,
    clientId:String,
    user:{type: Schema.Types.ObjectId,ref:'users'},
   project:{type: Schema.Types.ObjectId,ref:'project'},
   module:{type: Schema.Types.ObjectId,ref: 'module'}

})

module.exports=mongoose.model("task",localSchema);