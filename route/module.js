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
    var moduleData = req.body.moduleData;
    newmodule.title = moduleData.title;
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
    newmodule.projectId = moduleData.projectId;
    if(!moduleData.projectId)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter projectId also'
        })
    }
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
                message:"data saved"
            })
        }
    })
})

router.put('/update/:id', (req,res)=>
{    var moduleData = req.body.moduleData;
    Module.update({_id:req.params.id},{
        $set:{title:moduleData.title,
            description:moduleData.description,
            projectId:moduleData.projectId
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
})

router.get('/find/:id', (req,res)=>
{
    Module.find({_id:req.params.id},(err,doc)=>
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

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(search){
        query={'$or':[{title:new RegExp(search,'i')},
        {clientId:new RegExp(clientId,'i')}]}
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
  
    Module.find(query,{},skipCondition,(err,doc)=>
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


