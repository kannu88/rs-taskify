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
    newTask.projectId = taskData.projectId;
    if(!taskData.projectId)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter project ID also'
        })
    }
    newTask.moduleId = taskData.moduleId;
    newTask.commentId = taskData.commentId;
    newTask.tags = taskData.tags;
    newTask.clientId = taskData.clientId;

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


})


router.put('/update/:id',(req,res)=>
{
    var taskData = req.body.taskData;
    Task.update({_id:req.params.id},
        {$set:{title:taskData.title,
        description:taskData.description,
    status:taskData.status,
assigning:taskData.assigning,
creator:taskData.creator,
watchlist:taskData.watchlist,
priority:taskData.priority,
projectId:taskData.projectId,
moduleId:taskData.moduleId,
commentId:taskData.commentId,
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
})

router.get('/find/:id', (req,res)=>
{
    Task.find({_id:req.params.id},(err,doc)=>
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

    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(search){
        query={'$or':[{title:new RegExp(search,'i')},
        {projectId:new RegExp(projectId,'i')},
        {moduleId:new RegExp(moduleId,'i')}]}
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
  
    Task.find(query,{},skipCondition,(err,doc)=>
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


module.exports = router;