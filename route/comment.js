var express = require('express');
var router = express.Router();
console.log("comment added");
var Comment = require('../model/commentSchema');

router.post('/insert',(req,res)=>
{
    var newComment = Comment();
    var commentData = req.body.userData;
    
    newComment.body = commentData.body;
    if(!commentData.body)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter body also'
        })
    }
    newComment.user = commentData.user;
    if(!commentData.user)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter user ID also'
        })
    }
    newComment.task = commentData.task;
    if(!commentData.task)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter name also'
        })
    }

    newComment.save((err,doc)=>
    {
        if(err)
        {
            res.status(400).json({
                success:false,
                message:"comment not inserted"
            })
        }
        else
        {
            res.json({
                success:true,
                message:"one comment inserted",
                doc:doc
            })
        }
    })
})

router.put('/update/:id', (req,res)=>
{
    var commentData = req.body.commentData;
    Comment.update({_id:req.params.id},{$set:{
        body:commentData.body,
        task:commentData.task,
        user:commentData.user
    }},{},(err,doc)=>
    {  if(err)
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
    Comment.find({_id:req.params.id}).populate('user').populate('task').exec((err,doc)=>
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


router.get('/paging',(req,res)=>
{
    var task = req.query.task;
    var sort = req.query.sort;

    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    query={task:task}

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
  
    Comment.find(query,{},skipCondition).populate('user').populate('task').exec((err,doc)=>
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

router.get('/recentcomment',(req,res)=>{
  Comment.find({}).sort({_id:-1}).limit(5).populate('user').populate('task').exec((err,doc)=>{
      if(err){
          res.status(400).json({
              success:false,
              message:'not found any record'
          })      }

          else{
              res.json({
                  success:true,
                  message:'Comment found',
                  doc:doc
              })
          }
  })  
})

module.exports =router;