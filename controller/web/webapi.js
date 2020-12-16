var express = require('express');
var bodyParser = require('body-parser');
var dbconnection=require('../../connection/db');
var router = express.Router();


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',function(req,res,next){
   console.log( "connected");
   res.send(JSON.stringify("connected"));

})

router.get('/userlogin',function(req,res){
 let pro_name="select * from tbl_attendance";
 dbconnection(pro_name, (err, result) => {
   if (err) 
   res.send(JSON.stringify(err));
   else    
   res.send(JSON.stringify(result[0]));
 })
})

router.post('/resetpassword',function(req,res){
  let pro_name="CALL SP_Web_ResetPassword('"+req.body.params._emailId+"','"+req.body.params._oldpassword+"','"+req.body.params._newpassword+"')";
  dbconnection(pro_name, (err, result) => {
    if (err) 
    res.send(JSON.stringify(err));
    else 
    console.log(JSON.stringify(result[0]));
    res.send(JSON.stringify(result[0]));
  })
})

router.get('/getproducts',function(req,res){
  let pro_name="CALL SP_Web_UserLogin('"+req.query.username+"','"+req.query.password+"')"

})
module.exports = router;