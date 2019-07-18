var express = require('express')
var router = express.Router()
//var app = express()
var jwt = require('jsonwebtoken');

console.log("task added");

var Task = require('../model/taskSchema');



router.post('/insert', (req,res)=>
{
    var newTask = Task()
    var taskData = req.body.userData;
    
    newTask.title = taskData.title;
    if(!taskData.title)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter title also'
        })
    }
    newTask.description=taskData.description;
    if(!taskData.description)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter title also'
        })
    }
    newTask.status = taskData.status;
    if(!taskData.status)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter status also'
        })
    }
    newTask.assigning = taskData.assigning;
    if(!taskData.assigning)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter assigning also'
        })
    }
    newTask.creator = taskData.creator;
    if(!taskData.creator)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter creator also'
        })
    }
    newTask.watchlist = taskData.watchlist;
    newTask.priority = taskData.priority;
    newTask.commentId = taskData.commentId;
    newTask.tags = taskData.tags;
    newTask.clientId = taskData.clientId;
    newTask.user = taskData.user;
    newTask.project = taskData.project;
    newTask.module=taskData.module;
    Task.findOne({title:newTask.title,project:newTask.project},(err,doc)=>
    {
        if(!doc){
    
    newTask.save((err,doc)=>
    {
        if(err)
        {   
            res.status(400).json({
                success:false,
                message:"task not aaded"
            })
        }
        else
        {
            res.json({
                success:true,
                message:"task added",
                doc:doc
            })
        }
    })

}
else{
    console.log("Error")
    res.json({
        success:false,
        message:"alreadyExist"
    })
}
})
})


router.put('/update/:id',(req,res)=>
{
    var taskData = req.body.userData;
    Task.findOne({title:taskData.title,project:taskData.project,_id:{'$ne':req.params.id}},(err,doc)=>
    {
        if(!doc){

        
    
    Task.update({_id:req.params.id},
        {$set:{title:taskData.title,
        description:taskData.description,
    status:taskData.status,
watchlist:taskData.watchlist,
priority:taskData.priority,
project:taskData.project,
module:taskData.module,
assigning:taskData.assigning,
tags:taskData.tags,
client:taskData.client}},{},(err,doc)=>
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
    Task.find({_id:req.params.id}).populate('user').populate('project').populate('module').exec((err,doc)=>
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
    var search = req.query.search;
 
    var projectId = req.query.projectId;
    var moduleId = req.query.moduleId;
    var sort = req.query.sort;
    var userId = req.query.userId;
    var assigning =req.query.assigning;
    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(search){
        query={title:new RegExp(".*"+search+".*","i")}
    }
    if(userId)  
     { query={user:userId}}
     if(assigning){
         query={assigning:assigning}
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
  
    Task.find(query,{},skipCondition).populate('project').populate('user').populate('module').exec((err,doc)=>
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
    var assigning = req.query.assigning;
    Task.aggregate([{$match:{assigning:assigning}},{$group : {_id : "$status", count : {$sum : 1}}}]).exec((err,doc)=>{
        if(err){
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
router.get('/count1',(req,res)=>{
    
    Task.aggregate([{$group : {_id : "$status", count : {$sum : 1}}}]).exec((err,doc)=>{
        if(err){
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

router.get('/recenttask',(req,res)=>{
    var assigning = req.query.assigning;
    Task.find({assigning:assigning}).sort({_id:-1}).limit(5).populate('user').populate('project').exec((err,doc)=>{
        if(err){
            res.status(400).json({
                success:false,
                message:'not found any record'
            })      }
  
            else{
                res.json({
                    success:true,
                    message:'Task found',
                    doc:doc
                })
            }
    })  
  })

module.exports = router;