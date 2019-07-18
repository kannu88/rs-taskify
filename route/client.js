var express = require('express')
var router = express.Router()

console.log("Client added");
var Client = require('../model/clientSchema');
//client insert API
router.post('/insert',(req,res)=>
{
    var newClient = Client();
    var clientData = req.body.userData;
    newClient.name=clientData.name;
    if(!clientData.name){
        return res.status(400).json({
            success:false,
            message:"Name is required"
        })
    }
    newClient.email = clientData.email;
    if(!clientData.email){
        return res.status(400).json({
            success:false,
            message:"email is required"
        })
    }
    newClient.phoneNo = clientData.phoneNo;
    if(!clientData.phoneNo){
        return res.status(400).json({
            success:false,
            message:"phone Number is required"
        })
    }
    newClient.companyName = clientData.companyName;
    if(!clientData.companyName){
        return res.status(400).json({
            success:false,
            message:"company Name is required"
        })
    }
    newClient.user = clientData.user;
    Client.findOne({email:newClient.email,user:newClient.user},(err,doc)=>
    {
        if(!doc){
    
    newClient.save((err,doc)=>{
        if(err){
            res.status(400).json({
                success:false,
                message:"client is not added"
            })
        }
        else{
            res.json({
                success:true,
                message:"Client Added successfully",
                doc:doc
            })
        }
    })
}
else{
    res.json({
        success:false,
        message:"alreadyExist"
    })
}
})
})
//client update
router.put('/update/:id',(req,res)=>
{   console.log("this is it");
    var clientData = req.body.userData;
    console.log(clientData)
    Client.findOne({email:clientData.email,user:clientData.user,_id:{'$ne':req.params.id}},(err,doc)=>{
      if(!doc){  
    
    Client.update({_id:req.params.id},
        {$set:{name:clientData.name,
        email:clientData.email,
        phoneNo:clientData.phoneNo,
        companyName:clientData.companyName
}},{},(err,doc)=>
{
    if(err)
    {
        res.status(400).json({
            success:false,
            message:"not updated"
        })
    }
    else{
        res.json({
            success:true,
            message:"updated",
            doc:doc
        })
    }
    
})
      }
      else{
          res.json({
              success:false,
              message:"alreadyExist"
          })
      }
})
})
router.get('/find/:id', (req,res)=>
{
    Client.find({_id:req.params.id}).populate('user').exec((err,doc)=>
    {
        if(err)
        {
            res.status(400).json({
                success:false,
                message:"not found"
            })
        }
        else{
            res.json({
                success:true,
                message:"found",
                doc:doc[0]
            })
        }
    })
})
router.get('/paging',(req,res)=>
{
   
    var sort = req.query.sort;
    var userId = req.query.userId;
    var userId1 = req.query.userId1;
    var search = req.query.search;
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(userId){
    query={user:userId}
    }
    if(search){
        query={name:new RegExp(".*"+search+".*","i"),user:userId1}
    }
    if(sort)
    {
    //      if(sort==="asc")
    //      {
    //          sort=1
    //      }
    //     else(sort==="desc")
    //      {
    //          sort = -1
    //      }
         skipCondition.sort = sort;
    }
    if(pageNo<=0|| pageNo===0  )
    {
        res.status(400).json({
            message:"error in page number",
            success:false
        })
    }
  
    Client.find(query,{},skipCondition).populate('user').exec((err,doc)=>
    {
        if(err)
        {
            res.status(400).json({
                message:"error in pagin",
                success:false
            })
        }
        else{
            res.json({
                message:"paging successfull",
                success:true,
                doc:doc
            })
        }
    })
})
router.get('/count', (req,res)=>
{
    Client.find({user:req.query.user}).populate('user').count().exec((err,doc)=>
    {
        if(err)
        {
            res.status(400).json({
                success:false,
                message:"not found"
            })
        }
        else{
            res.json({
                success:true,
                message:"found",
                doc:doc,
                
            })
        }
    })
})
module.exports = router;