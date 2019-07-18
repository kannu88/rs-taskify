var express = require('express')
var router = express.Router()
var nodemailer = require('nodemailer')
var app = express()
var multer = require('multer');
// var upload      = multer({ dest: 'uploads/',fileFilter:function(req,file,cb){
//     console.log('file is',file)
//     cb(null,true);
// }
// });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
  var upload = multer({ storage: storage })
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
var ls = require('local-storage');
console.log("user route called")
var email="";
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
    console.log(req.body.userData);
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
    newUser.profilePicture = "download.png"
    newUser.save((err,doc)=>
    {
        if(err)
        {   console.log(err.name);
            res.json({
                success:false,
                message:"data not saved",
                error:err.name
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
        query={name:new RegExp(".*"+search+".*","i")}
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
    User.findOne({email:req.body.userData.email},(err,user)=>
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
        if(user)
        {
            
            if(passwordHash.verify(req.body.userData.password,user.password))
            {
                const payload = {
                    email:user.email
                };
                var token = jwt.sign(payload,"21JHJKHIUKJH9O8IHINK",{
                    expiresIn:'24h'
                })
                ls.set('token',token);
                console.log(user._id);
                console.log(ls.get('token'));
                res.json({
                    success:true,
                    message:"enjoy your token",
                    token:token,
                    id:user.id
                    
                    
                })
            }
            else{
               
                res.json({
                    success:false,
                    message:"authentication failed password is incorrect"
                })
            }
        }

    });
})

router.post('/resetpassword', (req,res)=>
{
    var oldPassword = req.body.userData.oldPassword;
    var newPassword = passwordHash.generate(req.body.userData.newPassword)

    User.findOne({email:req.body.userData.email},(err,user)=>
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
        console.log(req.query.email);
        email = req.query.email;
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
                to : fPassword.email,
                subject : "Password change",
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

        forgotPassword.findOne({email:fPassword.email},(err,doc)=>{
            if(doc){
                forgotPassword.updateOne({email:fPassword.email},{$set:{otp:fPassword.otp}},(err,doc)=>{
                    if(err){
                        res.status(400).json({
                            success:false,
                            message:"Error in the otp updation"
                        })
                    }
                    else{
                        res.json({
                            success:true,
                            message:"OTP updated successfully"
                        })
                    }
                })
            }
        else{
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
    }
})
    }}
    )
})

router.post('/forgotPassword', (req,res)=>
{   var newPassword1 = req.body.userData.newPassword;
    console.log(email);
    forgotPassword.findOne({otp:req.body.userData.otp,email:email},(err,doc)=>
    {   
        if(!doc)
        {   
            res.json({
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

  //last day data

  router.get('/lastday',(req,res)=>
  { //console.log(new Date(new Date().setDate(new Date().getDate()-1)))
      User.find({DOB:{$gte:new Date(new Date().setDate(new Date().getDate()-2))}},(err,doc)=>
      { if(err){
          res.status(400).json({
              success:false,
              message:"not found"
          })
        }
        else{
            res.json({
                success:true,
                message:"data found",
                doc:doc
            })
        }
      })
  })
  router.post('/upload/:id',upload.single('file'),(req,res)=>{
    console.log(req.file);
    
    User.update({_id:req.params.id},{$set:{
         profilePicture:req.file.originalname}
     },{},(err,doc)=>{
         if(err){
             res.status(400).json({
                 success:false,
                 message:"Error in uploading"
             })
         }
         else{
             res.json({
                 success:true,
                 message:"Picture Uploaded"
             })
         }
     })

})
module.exports=router;