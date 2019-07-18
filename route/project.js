var express = require('express')
var router = express.Router()

console.log("project added")

var Project = require('../model/projectSchema')
// router.get('/', (req,res)=>
// {
//     res.send("succesfull")
// })



router.post('/insert', (req,res)=>
{
    var newUser = Project()
   //console.log(req)
    var userData = req.body.userData;
    newUser.title = userData.title;
    
    if(!userData.title)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter title also'
        })
    }
    newUser.status = userData.status;
    if(!userData.status)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter status also'
        })
    }
    
    
    newUser.client = userData.client;
    
    newUser.description = userData.description;
    if(!userData.description)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter description also'
        })
    }
    newUser.user=userData.user;
    Project.findOne({title:newUser.title,user:newUser.user},(err,doc)=>
    {
       if(!doc){
    
    newUser.save((err,doc)=>
    {
        if(err)
        {   console.log(err);
            res.status(400).json({
                success:false,
                message:"data not saved"
            })
        }

        else{
            console.log(req.body.userData);
            res.json({
                success:true,
                message:"data saved",
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
router.put('/update/:id', (req,res)=>
{    var userData = req.body.userData;
Project.findOne({title:userData.title,user:userData.user,_id:{'$ne':req.params.id}},(err,doc)=>{
  
    if(!doc){
       
    Project.update({_id:req.params.id},{
        $set:{title:userData.title,
            status:userData.status,
            client:userData.client,
    description:userData.description
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
                message:"one record updated",
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
    Project.find({_id:req.params.id}).populate('client').populate('user').exec((err,doc)=>
    {
        if(err)
        {
            res.status(400).json({
                success:false,
                message:"Not found"
            })
        }

        else{
            res.json({
                success:true,
                message:"record found",
                doc:doc[0]
            })
        }
    })
})


// router.get('/inc/:id',(req,res)=>
// {
//     User.find({_id:req.params.id},(err,doc)=>
//     { if(err)
//         {
//             res.status(400).json({
//                 success:false,
//                 message:"not found"
//             })
//         }
//         else{
//             res.json({
//                 success:true,
//                 message:"record",
//                 doc:doc[0]
//             })
//             // TODO: increase views by 1
//             User.update({_id:req.params.id},
                
//                 {$inc: { views:1}}, 
//                 {},
//                 (err, doc)=>{
//                     console.log(doc)
//                 })
//         }

//     })
// })


router.get('/paging',(req,res)=>
{
    var search = req.query.search;
    var clientId = req.query.clientId;
    var userId = req.query.userId;
    var sort = req.query.sort;
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(search){
        query={title:new RegExp(".*"+search+".*","i")}
    }
    if(userId){
        query={user:userId}}
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
  
    Project.find(query,{},skipCondition).populate('user').populate('client').exec((err,doc)=>
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
router.get('/count',(req,res)=>{
    var userId = req.query.userId;
    Project.aggregate([{$group : {_id : "$status", count : {$sum : 1}}}]).exec((err,doc)=>{
        if(err){
            console.log(err);
            res.status(400).json({
                message:'not found anything',
                success:false
            })
        }
        else{res.json({
            message:"found record",
            success:true,
            doc:doc
        })}
    })
})
module.exports=router;

