var express = require('express')
var router = express.Router()
var app = express()
var jwt = require('jsonwebtoken');

console.log("user route called")

var User = require('../model/userSchema')
// router.get('/', (req,res)=>
// {
//     res.send("succesfull")
// })



router.post('/insert', (req,res)=>
{
    var newUser = User()
   // console.log(req)
    var userData = req.body.userData;
    newUser.name = userData.name;
    if(!userData.name)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter name also'
        })
    }
    newUser.email = userData.email;
    if(!userData.email)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter email also'
        })
    }
    
    newUser.profilePicture = userData.profilePicture;
    newUser.phoneNo = userData.phoneNo;
    if(!userData.phoneNo)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter phone number also'
        })
    }
    newUser.password = userData.password;
    if(!userData.password)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter password also'
        })
    }
    newUser.age = userData.age;

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
            res.json({
                success:true,
                message:"data saved"
            })
        }
    })
})

router.put('/update/:id', (req,res)=>
{    var userData = req.body.userData;
    User.update({_id:req.params.id},{
        $set:{password:userData.password,
            name:userData.name,
            profilePicture:userData.profilePicture,
    email:userData.email,
    age:userData.age,
    phoneNo:userData.phoneNo
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
    User.find({_id:req.params.id},(err,doc)=>
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
    var email = req.query.email;
    //var phoneNo = req.query.phoneNo;
    var sort = req.query.sort;

    var pageNo = parseInt(req.query.pageNo);
    var size = parseInt(req.query.size);

    var skipCondition = {};
    skipCondition.skip = size*(pageNo-1)
    skipCondition.limit = size;

    var query ={};
    if(search){
        query={'$or':[{name:new RegExp(search,'i')},
        {email:new RegExp(email,'i')}]}
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
  
    User.find(query,{},skipCondition,(err,doc)=>
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


router.post('/authenticate',(req,res)=>
{
    User.findOne({name:req.body.name},(err,user)=>
    {
        if(err)
        {
            res.json({
                success:false,
                message:"error in name"
            })
        }
        if(!user)
        {
            res.json({
                success:false,
                message:"user not found"
            })
        }
        else if(user)
        {
            if(user.password!==req.body.password)
            {
                res.json({
                    success:false,
                    message:"authentication failed password is incorrect"
                })
            }
            else{
                const payload = {
                    admin:user.admin
                };
                var token = jwt.sign(payload,'21JHJKHIUKJH9O8IHINK',{
                    expiresIn:'24h'
                })
                res.json({
                    success:true,
                    message:"enjoy your token",
                    token:token
                })
            }
        }

    });
})
module.exports=router;