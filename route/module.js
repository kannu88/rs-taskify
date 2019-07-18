var express = require('express')
var router = express.Router()

console.log("module route called")

var Module = require('../model/moduleSchema')
// router.get('/', (req,res)=>
// {
//     res.send("succesfull")
// })



router.post('/insert', (req,res)=>
{
    var newmodule = Module()
   // console.log(req)
    var moduleData = req.body.userData;
    newmodule.title = moduleData.title;
    newmodule.user = moduleData.user;
    if(!moduleData.title)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter title also'
        })
    }
    
    
    
    
    newmodule.description = moduleData.description;
    if(!moduleData.description)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter description also'
        })
    }
   newmodule.project = moduleData.project;
   Module.findOne({title:moduleData.title,project:moduleData.project},(err,doc)=>
   {
    if(!doc){

    newmodule.save((err,doc)=>
    {
        if(err)
        {
            res.status(400).json({
                success:false,
                message:"data not saved"
            })
        }

        else{
            res.json({
                success:true,
                message:"data saved",
                doc:doc
            })
        }
    })
}
else{
    console.log('Error')
    res.json({
        success:false,
        message:"alreadyExist"
    })
}
})
})

router.put('/update/:id', (req,res)=>
{    var moduleData = req.body.userData;
    Module.findOne({title:moduleData.title,project:moduleData.project,_id:{'$ne':req.params.id}},(err,doc)=>{
        if(!doc){
    
    Module.update({_id:req.params.id},{
        $set:{title:moduleData.title,
            description:moduleData.description,
            project:moduleData.project
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
    Module.find({_id:req.params.id}).populate('user').populate('project').exec((err,doc)=>
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
    var sort = req.query.sort;
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);
    var userId = req.query.userId;
    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(search){
        query={title:new RegExp(".*"+search+".*","i")}
    }
    if(userId){
    query={user:userId};
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
  
    Module.find(query,{},skipCondition).populate('user').populate('project').exec((err,doc)=>
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
module.exports=router;


