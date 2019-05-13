var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
    body:String,
    userId:String,
    TaskId:String
})

module.exports = mongoose.model("comment",localSchema);