//uploading files....
var express = require('express')
var router = express.Router();
var multer = require('multer');
var upload      = multer({ dest: 'route/',fileFilter:function(req,file,cb){
    console.log('file is',file)
    cb(null,true);
}
});

console.log("learn added");
router.post('/upload',upload.single('abc'),(req,res)=>{
    console.log(req.body)
res.json({
    success:true,
    message:"done"
})
})
//uploading multiple files....

router.post('/uploadmultiple',upload.array('abc',12),(req,res)=>{
    console.log(req.body)
res.json({
    success:true,
    message:"done"
})
})

router.get('/download/:file(*)',(req, res) => {
    var file = req.params.file;
   // var fileLocation = (file);
   // console.log(fileLocation);
    res.sendFile(file); 
  });

module.exports = router