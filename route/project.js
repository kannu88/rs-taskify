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
   // console.log(req)
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
    
    
    newUser.clientId = userData.clientId;
    if(!userData.clientId)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter clientId also'
        })
    }
    newUser.description = userData.description;
    if(!userData.description)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter description also'
        })
    }

    newUser.save((err,doc)=>
    {
        if(err)
        {
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
})

router.put('/update/:id', (req,res)=>
{    var userData = req.body.userData;
    
    Project.update({_id:req.params.id},{
        $set:{title:userData.title,
            status:userData.status,
            clientId:userData.clientId,
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
})

router.get('/find/:id', (req,res)=>
{
    Project.find({_id:req.params.id},(err,doc)=>
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
  
    Project.find(query,{},skipCondition,(err,doc)=>
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

