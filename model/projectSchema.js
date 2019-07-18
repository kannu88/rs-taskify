var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var localSchema = new Schema({
    title:{type:String},
    status:{type:String},
    description:String,
    user:{type: Schema.Types.ObjectId,ref:'users',index:true},
    client:{type:Schema.Types.ObjectId,ref:'clients'}
});
module.exports= mongoose.model("project",localSchema);
