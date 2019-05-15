var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var app = express()
//for otp
var otpGenerator = require('otp-generator');
//for sending mail
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "lokeshbhutani51@gmail.com",
        pass: "8827540628"
    }
});
var jwt = require('jsonwebtoken');

console.log("user route called")

var User = require('../model/userSchema')
var forgotPassword = require('../model/fpSchema');
// router.get('/', (req,res)=>
// {
//     res.send("succesfull")
// })

var passwordHash = require('password-hash');

router.post('/insert', (req,res)=>
{
    var newUser = User()
    console.log("user inserted data")
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
    newUser.password = passwordHash.generate(userData.password);
    if(!userData.password)
    {
        return res.status(400).json({
            success:false,
            message: 'Please enter password also'
        })
    }
    newUser.age = userData.age;
    newUser.DOB = userData.DOB;

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


router.post('/login',(req,res)=>
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
            if(passwordHash.verify(req.body.password,user.password))
            {
                res.json({
                    success:false,
                    message:"authentication failed password is incorrect"
                })
            }
            else{
                const payload = {
                    email:user.email
                };
                var token = jwt.sign(payload,"21JHJKHIUKJH9O8IHINK",{
                    expiresIn:'24h'
                })
                res.json({
                    success:true,
                    message:"enjoy your token",
                    token:token,
                    
                })
            }
        }

    });
})

router.post('/resetpassword', (req,res)=>
{
    var oldPassword = req.body.oldPassword;
    var newPassword = passwordHash.generate(req.body.newPassword)

    User.findOne({email:req.body.email},(err,user)=>
    {
        if(err)
        {
            res.status(400).json({
                success:false,
                message:"error in email"
            })
        }
        if(!user)
        {
            res.json({
                success:false,
                message:"email not found"
            })
        }
     if(user)
        {
            if(passwordHash.verify(oldPassword,user.password))
            {
                User.update({email:user.email},{$set:{
                    password:newPassword}},{},(err,doc)=>
                    {
                        if(err)
                        {
                            res.status(400).json({
                                success:false,
                                message:"can not update"
                            })
                        }
                        else{
                            res.json({
                                success:true,
                                message:"password reset",
                                doc:doc
                            })
                        }
                    })
            }
            else{
                res.json({
                    success:false,
                    message:"password is wrong"
                })
            }
        }
    })

})

router.get('/forgotPassword',(req,res)=>
{  var fPassword = forgotPassword();

    User.findOne({email:req.query.email},(err,doc)=>
    {
        if(err)
        {
            res.json({
                success:false,
                message:"email not found"
            })
        }
        else if(doc){
            var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets: false})
            fPassword.email = doc.email;
            fPassword.otp = otp;
            var mailOptions={
                to : req.body.to,
                subject : req.body.subject,
                text :"otp:" + otp
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
             if(error){
                    console.log(error);
                res.end("error");
             }else{
                    console.log("Message sent: " + response.message);
                res.end("sent");
                 }
        });
        fPassword.save((err,user)=>
        {
            if(err)
            {
                res.status(400).json({
                    success:false,
                    message:"not saved"
                })
            }
            else{
                res.json({
                    success:true,
                    message:"data saved",
                    user:user
                })
                
            }
        })
    }}
    )
})

router.post('/forgotPassword/:otp', (req,res)=>
{   var newPassword1 = req.body.newPassword
    forgotPassword.findOne({otp:req.params.otp},(err,doc)=>
    {
        if(err)
        {
            res.status.json({
                success:false,
                message:"error in the link"
            })
        }
        else if(doc){
            User.updateOne({email:doc.email},{$set:{
                password:passwordHash.generate(newPassword1)
            }},{},(err,doc1)=>
            {
                if(err)
                {
                    res.status(400).json({
                        success:false,
                        message:"password not changed"
                    })
                }
                else{
                    res.json({
                        success:true,
                        message:"password changed",
                        doc1:doc1
                    })
                }
            })
        }
    })
})
//for sending mail
/*
router.post('/sendmail',function(req,res){
    var mailOptions={
        to : req.body.to,
        subject : req.body.subject,
        text :"otp:" + otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets: false})
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
});
});*/
  router.get('/filterDate',(req,res)=>
  {
      var startDate =req.body.startDate;
      var endDate = req.body.endDate;
      User.find({DOB:{'$gte':startDate,'$lt':endDate}},(err,doc)=>{
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
                    message:"record found",
                    doc:doc
                })
            }
      }
      

      )
  })
module.exports=router;