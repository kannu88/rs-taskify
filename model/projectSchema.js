var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
    title:String,
    status:String,
    clientId:String,
    description:String,
});

module.exports= mongoose.model("project",localSchema);

