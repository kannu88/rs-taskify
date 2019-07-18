var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
    body:String,
    user:{type: Schema.Types.ObjectId, ref:'users'},
    task:{type: Schema.Types.ObjectId,ref:'task'}
})

module.exports = mongoose.model("comment",localSchema);